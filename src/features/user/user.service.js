import * as userRepository from "./user.repository.js";
import generateSecureOtp from "../../utils/otp-generator.utility.js";
import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import {
    generateSecureTokens,
    getTokenExpiry,
} from "../../utils/token-generator.utility.js";
import { EMAIL_EXPIRY_MINUTES } from "../../services/email/email.constans.js";
import {
    sendEmailChangedSuccessfullyEmail,
    sendEmailChangeVerificationEmail,
    sendInstructorAccessVerificationEmail,
    sendInstructorAccessGrantedEmail,
    sendAccountDeactivationOtpEmail,
    sendAccountDeactivatedEmail,
} from "../../services/email/email.services.js";
import {
    createEmailChangeVerificationUrl,
    createInstructorAccessVerificationUrl,
} from "../../services/email/email.utility.js";
import logger from "../../utils/pino-logger.utility.js";
import crypto from "crypto";
import { ROLES, USER_TOKEN_FIELDS } from "./user.constants.js";

///////////////////////////////////////////////////////////////
// update username service

const updateUsername = async ({ user, username }) => {
    user.username = username;
    return await userRepository.saveUser(user, true);
};

///////////////////////////////////////////////////////////////
// request email updation service

const requestEmailUpdation = async ({ user, password, newEmail }) => {
    const dbUser = await userRepository
        .findUserById(user._id)
        .select("+password");

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

    const existingUser = await userRepository.findUserByEmail(newEmail);

    if (existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: "Email address is already in use.",
        });
    }

    const { token, hashedToken } = generateSecureTokens();

    dbUser.pendingEmail = newEmail;
    dbUser.emailChangeToken = hashedToken;
    dbUser.emailChangeTokenExpiry = getTokenExpiry(
        EMAIL_EXPIRY_MINUTES.CHANGE_EMAIL_TOKEN_EXPIRY
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

    const dbUser = await userRepository.findUserByToken({
        ...USER_TOKEN_FIELDS.EMAIL_CHANGE,
        hashedToken,
    });

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
// request instructor access service

const requestInstructorAccess = async ({ user }) => {
    const dbUser = await userRepository.findUserById(user._id);

    if (!dbUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "User not found.",
        });
    }

    if (dbUser.role === ROLES.INSTRUCTOR) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "You already have instructor access.",
        });
    }

    const { token, hashedToken } = generateSecureTokens();

    dbUser.instructorAccessToken = hashedToken;
    dbUser.instructorAccessTokenExpiry = getTokenExpiry(
        EMAIL_EXPIRY_MINUTES.INSTRUCTOR_ACCESS_TOKEN_EXPIRY
    );

    await userRepository.saveUser(dbUser);

    try {
        await sendInstructorAccessVerificationEmail({
            email: dbUser.email,
            username: dbUser.username,
            actionUrl: createInstructorAccessVerificationUrl(token),
        });
    } catch (error) {
        dbUser.instructorAccessToken = null;
        dbUser.instructorAccessTokenExpiry = null;

        await userRepository.saveUser(dbUser);

        logger.error(
            {
                err: error,
                userId: dbUser._id,
            },
            "Failed to send instructor access verification email."
        );

        throw error;
    }
};

///////////////////////////////////////////////////////////////
// confirm instructor access service

const confirmInstructorAccess = async ({ user, token }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const dbUser = await userRepository.findUserByToken({
        ...USER_TOKEN_FIELDS.INSTRUCTOR_ACCESS,
        hashedToken,
    });

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

    if (dbUser.role === ROLES.INSTRUCTOR) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "You already have instructor access.",
        });
    }

    dbUser.role = ROLES.INSTRUCTOR;

    dbUser.instructorAccessToken = null;
    dbUser.instructorAccessTokenExpiry = null;

    await userRepository.saveUser(dbUser);

    try {
        await sendInstructorAccessGrantedEmail({
            email: dbUser.email,
            username: dbUser.username,
        });
    } catch (error) {
        logger.warn(
            {
                err: error,
                userId: dbUser._id,
            },
            "Failed to send instructor access confirmation email."
        );
    }
};

///////////////////////////////////////////////////////////////
// fetch instructor profile service

const fetchInstructorProfile = async ({ instructorId }) => {
    const instructor = await userRepository.findUserById({
        userId: instructorId,
    });

    if (!instructor) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "Instructor profile not found",
        });
    }

    if (instructor.role !== ROLES.INSTRUCTOR) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "Instructor profile not found",
        });
    }

    return instructor;
};

///////////////////////////////////////////////////////////////
// user account deactivation request service

const requestAccountDeactivation = async ({ user, password }) => {
    const dbUser = await userRepository
        .findUserById(user._id)
        .select("+password");

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

    const { otp, hashedOtp } = generateSecureOtp();

    dbUser.accountDeactivationOtp = hashedOtp;

    dbUser.accountDeactivationOtpExpiry = getTokenExpiry(
        EMAIL_EXPIRY_MINUTES.ACCOUNT_DEACTIVATION_OTP_EXPIRY
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
        .findUserById(user._id)
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
    requestEmailUpdation,
    confirmEmailUpdation,
    requestInstructorAccess,
    confirmInstructorAccess,
    requestAccountDeactivation,
    confirmAccountDeactivation,
    fetchInstructorProfile,
};
