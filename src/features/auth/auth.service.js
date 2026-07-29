import jwt from "jsonwebtoken";
import crypto, { hash, Hash } from "crypto";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import {
    generateSecureTokens,
    getTokenExpiry,
} from "../../utils/token-generator.utility.js";
import * as userRepository from "../user/user.repository.js";
import * as authSession from "./auth.session.js";
import User from "../user/user.model.js";
import {
    sendEmailVerificationEmail,
    sendEmailVerifiedEmail,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    sendWelcomeEmail,
} from "../../services/email/email.services.js";
import { EMAIL_EXPIRY_MINUTES } from "../../services/email/email.constans.js";
import {
    createPasswordResetUrl,
    getEmailVerificationUrl,
} from "../../services/email/email.utility.js";
import { use } from "react";

///////////////////////////////////////////////////////////////
// registration service

const registerUser = async ({ username, email, password }) => {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: "User already exists with provided email.",
        });
    }

    const createdUser = await userRepository.createUser({
        username,
        email,
        password,
    });

    const { user, accessToken, refreshToken } =
        await authSession.createUserSession(createdUser);

    await sendWelcomeEmail({
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
            message: "Your email address is already verified.",
        });
    }

    const { token, hashedToken } = generateSecureTokens();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = getTokenExpiry(
        EMAIL_EXPIRY_MINUTES.VERIFICATION_TOKEN_EXPIRY
    );

    await userRepository.saveUser(user);

    try {
        await sendEmailVerificationEmail({
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
        .findUserByEmailVerificationToken(hashedToken)
        .select("+emailVerificationToken +emailVerificationExpiry");

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message:
                "Invalid or expired verification link. Please request a new verification email.",
        });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;

    await userRepository.saveUser(user);

    try {
        await sendEmailVerifiedEmail({
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
            message: "Invalid credentials.",
        });
    }

    if (!existingUser.isActive) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: "This account has been deactivated.",
        });
    }

    const isValidPassword = await existingUser.comparePassword(password);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid credentials.",
        });
    }

    return await authSession.createUserSession(existingUser);
};

///////////////////////////////////////////////////////////////
// logout service

const logout = async ({ user }) => {
    return authSession.destroyUserSession(user);
};

///////////////////////////////////////////////////////////////
// token rotation service

const rotateTokens = async ({ refreshToken }) => {
    const { userId, userEmail } = jwt.verify(
        refreshToken,
        jwtConfig.JWT_REFRESH_SECRET
    );

    const user = await userRepository
        .findUserById(userId)
        .select("+refreshToken");

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid or expired refresh token.",
        });
    }

    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    if (user.refreshToken !== hashedRefreshToken) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid or expired refresh token.",
        });
    }

    return authSession.createUserSession(user);
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
    user.resetPasswordExpiry = getTokenExpiry(
        EMAIL_EXPIRY_MINUTES.PASSWORD_RESET_TOKEN_EXPIRY
    );

    await userRepository.saveUser(user);

    try {
        await sendPasswordResetEmail({
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

    const user = await userRepository.findUserByPasswordResetToken(hashedToken);

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid or expired token",
        });
    }

    if (!user.isActive) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: "This account has been deactivated.",
        });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
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
            message: "Current password is incorrect.",
        });
    }

    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message:
                "New password must be different from your current password.",
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
