import jwt from "jsonwebtoken";
import crypto from "crypto";
import HTTP_STATUS from "../../constants/http-status.js";
import ApiError from "../../utils/errorHandler.js";
import generateTokens from "../../utils/tokenGenerator.js";
import * as authRepository from "./auth.repository.js";
import * as authSession from "./auth.session.js";
import User from "../user/user.model.js";
import {
    createEmailVerificationUrl,
    getEmailTokenExpiry,
} from "../../services/email/email.helpers.js";
import { EMAIL_CONFIG } from "../../constants/email-constans.js";
import {
    sendEmailVerifiedEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../../services/email/email.services.js";

///////////////////////////////////////////////////////////////
// registration service

const userRegistration = async ({ username, email, password }) => {
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: "User already exists with provided email.",
        });
    }

    const createdUser = await authRepository.createUser({
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
// email verification service

const userEmailVerification = async ({ token }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await authRepository
        .findByEmailToken(hashedToken)
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

    await authRepository.saveUser(user);

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

const userLogin = async ({ email, password }) => {
    const existingUser = await authRepository
        .findByEmail(email)
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

const userLogout = async (user) => {
    return authSession.destroyUserSession(user);
};

///////////////////////////////////////////////////////////////
// token rotation service

const rotateAuthTokens = async ({ refreshToken }) => {
    const { userId, userEmail } = jwt.verify(
        refreshToken,
        jwtConfig.JWT_REFRESH_SECRET
    );

    const user = await authRepository.findById(userId).select("+refreshToken");

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
// exports

export {
    userRegistration,
    userEmailVerification,
    userLogin,
    userLogout,
    rotateAuthTokens,
};
