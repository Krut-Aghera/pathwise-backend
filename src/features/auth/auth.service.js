import crypto from "crypto";
import jwt from "jsonwebtoken";

import * as authSession from "./auth.session.js";
import * as userRepository from "../user/user.repository.js";
import * as authEmail from "../../services/email/mailers/auth.mailer.js";

import User from "../user/user.model.js";

import logger from "../../utils/pino-logger.utility.js";
import ApiError from "../../utils/error-handler.utility.js";

import {
    generateSecureTokens,
    getExpiry,
} from "../../utils/token-generator.utility.js";

import {
    createPasswordResetUrl,
    getEmailVerificationUrl,
} from "../../services/email/email.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { EMAIL_EXPIRY_MINUTES } from "../../services/email/email.constans.js";
import { USER_TOKEN_FIELDS } from "../user/user.constants.js";
import { AUTH_ERROR_MESSAGES } from "./auth.constants.js";
import { jwtEnvConfig } from "../../config/env.config.js";

///////////////////////////////////////////////////////////////
// registration service

const registerUser = async ({ username, email, password }) => {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
        });
    }

    const createdUser = await userRepository.createUser({
        username,
        email,
        password,
    });

    const { user, accessToken, refreshToken } =
        await authSession.createSession(createdUser);

    await authEmail.sendRegistrationEmail({
        email: user.email,
        username: user.username,
        // TODO : add user dashboard link
    });

    return { user, accessToken, refreshToken };
};

///////////////////////////////////////////////////////////////
// request email verification service

const requestEmailVerification = async ({ user }) => {
    if (user.isEmailVerified) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: AUTH_ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
        });
    }

    const { token, hashedToken } = generateSecureTokens();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = getExpiry(
        EMAIL_EXPIRY_MINUTES.VERIFICATION_TOKEN_EXPIRY
    );

    await userRepository.saveUser(user);

    try {
        await authEmail.sendEmailVerificationRequestEmail({
            email: user.email,
            username: user.username,
            actionUrl: getEmailVerificationUrl(token),
        });
    } catch (error) {
        user.emailVerificationToken = null;
        user.emailVerificationExpiry = null;

        await userRepository.saveUser(user);

        throw error;
    }
};

///////////////////////////////////////////////////////////////
// confirm email verification service

const confirmEmailVerification = async ({ token }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userRepository
        .findUserByToken({
            tokenField: USER_TOKEN_FIELDS.EMAIL_VERIFICATION.token,
            expiryField: USER_TOKEN_FIELDS.EMAIL_VERIFICATION.expiry,
            hashedToken,
        })
        .select("+emailVerificationToken +emailVerificationExpiry");

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message:
                AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_EMAIL_VERIFICATION_TOKEN,
        });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;

    await userRepository.saveUser(user);

    try {
        await authEmail.sendEmailVerificationConfirmEmail({
            email: user.email,
            username: user.username,
            // actionUrl: `${serverAppConfig.CLIENT_URL}/dashboard`,
        });
    } catch (error) {
        logger.warn(
            {
                err: error,
                userId: user._id,
            },
            "Failed to send email verification confirmation"
        );
    }

    return user;
};

///////////////////////////////////////////////////////////////
// login service

const login = async ({ email, password }) => {
    const existingUser = await userRepository
        .findUserByEmail(email)
        .select("+password");

    if (!existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
    }

    if (!existingUser.isActive) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: AUTH_ERROR_MESSAGES.ACCOUNT_DEACTIVATED,
        });
    }

    const isValidPassword = await existingUser.comparePassword(password);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
    }

    return await authSession.createSession(existingUser);
};

///////////////////////////////////////////////////////////////
// logout service

const logout = async ({ user }) => {
    return authSession.destroySession(user);
};

///////////////////////////////////////////////////////////////
// token rotation service

const rotateTokens = async ({ refreshToken }) => {
    const { userId, userEmail } = jwt.verify(
        refreshToken,
        jwtEnvConfig.JWT_REFRESH_SECRET
    );

    const user = await userRepository
        .findUserById(userId)
        .select("+refreshToken");

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_REFRESH_TOKEN,
        });
    }

    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    if (user.refreshToken !== hashedRefreshToken) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_REFRESH_TOKEN,
        });
    }

    return authSession.createSession(user);
};

///////////////////////////////////////////////////////////////
// request password reset service

const requestPasswordReset = async ({ email }) => {
    const user = await userRepository
        .findUserByEmail(email)
        .select("+resetPasswordToken +resetPasswordExpiry");

    if (!user || !user.isActive) {
        return;
    }

    const { token, hashedToken } = generateSecureTokens();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = getExpiry(
        EMAIL_EXPIRY_MINUTES.PASSWORD_RESET_TOKEN_EXPIRY
    );

    await userRepository.saveUser(user);

    try {
        await authEmail.sendPasswordResetRequestEmail({
            email: user.email,
            username: user.username,
            // actionUrl: createPasswordResetUrl(token),
            actionUrl: `http://localhost:8000/api/v1/auth/reset-password/${token}`,
        });
    } catch (error) {
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;

        await userRepository.saveUser(user);

        throw error;
    }
};

///////////////////////////////////////////////////////////////
// reset passwrod service

const resetPassword = async ({ token, newPassword }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userRepository.findUserByToken({
        tokenField: USER_TOKEN_FIELDS.PASSWORD_RESET.token,
        expiryField: USER_TOKEN_FIELDS.PASSWORD_RESET.expiry,
        hashedToken,
    });

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message:
                AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_RESET_PASSWORD_TOKEN,
        });
    }

    if (!user.isActive) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: AUTH_ERROR_MESSAGES.ACCOUNT_DEACTIVATED,
        });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    user.refreshToken = null;

    await userRepository.saveUser(user, true);

    try {
        await authEmail.sendPasswordResetConfirmEmail({
            email: user.email,
            username: user.username,
            //TODO add login page action url
        });
    } catch (error) {
        logger.warn(
            {
                err: error,
                userId: user._id,
            },
            "Failed to send password reset success email."
        );
    }
};

///////////////////////////////////////////////////////////////
// change passwrod service

const changePassword = async ({ userId, currentPassword, newPassword }) => {
    const user = await userRepository.findUserById(userId).select("+password");

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "User not found.",
        });
    }

    const isValidPassword = await user.comparePassword(currentPassword);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: AUTH_ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT,
        });
    }

    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: AUTH_ERROR_MESSAGES.PASSWORD_MUST_BE_DIFFERENT,
        });
    }

    user.password = newPassword;
    user.refreshToken = null;

    await userRepository.saveUser(user, true);

    try {
        await sendPasswordResetSuccessEmail({
            email: user.email,
            username: user.username,
            //TODO add login page action url
        });
    } catch (error) {
        logger.warn(
            {
                err: error,
                userId: user._id,
            },
            "Failed to send password change success email."
        );
    }
};

///////////////////////////////////////////////////////////////
// exports

export {
    registerUser,
    requestEmailVerification,
    confirmEmailVerification,
    login,
    logout,
    rotateTokens,
    requestPasswordReset,
    resetPassword,
    changePassword,
};
