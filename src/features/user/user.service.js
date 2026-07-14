import { USER_PROFILE } from "../../constants/user-profile";
import * as userRepository from "./user.repository.js";
import generateOtp from "../../utils/otpGenerator.js";
import ApiError from "../../utils/errorHandler.js";
import HTTP_STATUS from "../../constants/http-status.js";
import { generateTokens, getTokenExpiry } from "../../utils/tokenGenerator.js";
import { EMAIL_CONFIG } from "../../constants/email-constans.js";
import {
    sendEmailChangedSuccessfullyEmail,
    sendEmailChangeVerificationEmail,
    sendAccountDeactivationOtpEmail,
    sendAccountDeactivatedEmail,
} from "../../services/email/email.services.js";
import { createEmailChangeVerificationUrl } from "../../services/email/email.helpers.js";
import logger from "../../utils/pinoLogger.js";
import crypto from "crypto";

///////////////////////////////////////////////////////////////
// update username service

const updateUsername = async ({ user, username }) => {
    user.username = username;
    return await userRepository.saveUser(user, true);
};

///////////////////////////////////////////////////////////////
// request email updation service

const requestEmailUpdation = async ({ user, password, newEmail }) => {
    const dbUser = await userRepository.findById(user._id).select("+password");

    if (!dbUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "User not found.",
        });
    }

    const isValidPassword = await dbUser.comparePassword(password);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Current password is incorrect.",
        });
    }

    if (dbUser.email === newEmail) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message:
                "New email address must be different from your current email address.",
        });
    }

    const existingUser = await userRepository.findByEmail(newEmail);

    if (existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: "Email address is already in use.",
        });
    }

    const { token, hashedToken } = generateTokens();

    dbUser.pendingEmail = newEmail;
    dbUser.emailChangeToken = hashedToken;
    dbUser.emailChangeTokenExpiry = getTokenExpiry(
        EMAIL_CONFIG.CHANGE_EMAIL_TOKEN_EXPIRY_MINUTES
    );

    await userRepository.saveUser(dbUser);

    try {
        await sendEmailChangeVerificationEmail({
            email: dbUser.pendingEmail,
            username: dbUser.username,
            actionUrl: createEmailChangeVerificationUrl(token),
        });
    } catch (error) {
        dbUser.pendingEmail = null;
        dbUser.emailChangeToken = null;
        dbUser.emailChangeTokenExpiry = null;

        await userRepository.saveUser(dbUser);

        logger.error(
            {
                err: error,
                userId: dbUser._id,
            },
            "Failed to send email change verification email."
        );

        throw error;
    }
};

///////////////////////////////////////////////////////////////
// change email confirmation service

const confirmEmailUpdation = async ({ user, token }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const dbUser = await userRepository
        .findByEmailChangeToken(hashedToken)
        .select("+pendingEmail");

    if (!dbUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid or expired verification link.",
        });
    }

    if (!dbUser._id.equals(user._id)) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: "You are not authorized to perform this action.",
        });
    }

    if (!dbUser.pendingEmail) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "No email change request was found.",
        });
    }

    dbUser.email = dbUser.pendingEmail;

    dbUser.pendingEmail = null;
    dbUser.emailChangeToken = null;
    dbUser.emailChangeTokenExpiry = null;

    dbUser.refreshToken = null;

    await userRepository.saveUser(dbUser);

    try {
        await sendEmailChangedSuccessfullyEmail({
            email: dbUser.email,
            username: dbUser.username,
        });
    } catch (error) {
        logger.warn(
            {
                err: error,
                userId: dbUser._id,
            },
            "Failed to send email change confirmation email."
        );
    }
};

///////////////////////////////////////////////////////////////
// get instructor profile service

const instructorProfile = () => {};

///////////////////////////////////////////////////////////////
// user account deactivation request service

const requestAccountDeactivation = async ({ user, password }) => {
    const dbUser = await userRepository.findById(user._id).select("+password");

    if (!dbUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "User not found.",
        });
    }

    const isValidPassword = await dbUser.comparePassword(password);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Incorrect password.",
        });
    }

    const { otp, hashedOtp } = generateOtp();

    dbUser.accountDeactivationOtp = hashedOtp;

    dbUser.accountDeactivationOtpExpiry = getTokenExpiry(
        EMAIL_CONFIG.ACCOUNT_DEACTIVATION_OTP_EXPIRY_MINUTES
    );

    await userRepository.saveUser(dbUser);

    try {
        await sendAccountDeactivationOtpEmail({
            email: dbUser.email,
            username: dbUser.username,
            otp,
        });
    } catch (error) {
        dbUser.accountDeactivationOtp = null;
        dbUser.accountDeactivationOtpExpiry = null;

        await userRepository.saveUser(dbUser);

        throw error;
    }
};
///////////////////////////////////////////////////////////////
// user account deactivation confirmation service

const confirmAccountDeactivation = async ({ user, otp }) => {
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const dbUser = await userRepository
        .findById(user._id)
        .select("+accountDeactivationOtp +accountDeactivationOtpExpiry");

    if (!dbUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "User not found.",
        });
    }

    if (
        !dbUser.accountDeactivationOtp ||
        dbUser.accountDeactivationOtp !== hashedOtp ||
        dbUser.accountDeactivationOtpExpiry < new Date()
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid or expired verification code.",
        });
    }

    dbUser.isActive = false;

    dbUser.refreshToken = null;

    dbUser.accountDeactivationOtp = null;
    dbUser.accountDeactivationOtpExpiry = null;

    await userRepository.saveUser(dbUser);

    try {
        await sendAccountDeactivatedEmail({
            email: dbUser.email,
            username: dbUser.username,
        });
    } catch (error) {
        logger.warn(
            {
                err: error,
                userId: dbUser._id,
            },
            "Failed to send account deactivation confirmation email."
        );
    }
};

///////////////////////////////////////////////////////////////
// exports

export {
    updateUsername,
    instructorProfile,
    requestAccountDeactivation,
    confirmAccountDeactivation,
    requestEmailUpdation,
    confirmEmailUpdation,
};
