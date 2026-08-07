import crypto from "crypto";

import * as userRepository from "./user.repository.js";
import * as userEmail from "../../services/email/mailers/user.mailers.js";

import logger from "../../utils/pino-logger.utility.js";
import ApiError from "../../utils/error-handler.utility.js";
import generateSecureOtp from "../../utils/otp-generator.utility.js";
import {
    generateSecureTokens,
    getTokenExpiry,
} from "../../utils/token-generator.utility.js";
import {
    createEmailChangeVerificationUrl,
    createInstructorAccessVerificationUrl,
} from "../../services/email/email.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { EMAIL_EXPIRY_MINUTES } from "../../services/email/email.constans.js";
import {
    ROLES,
    USER_ERROR_MESSAGES,
    USER_TOKEN_FIELDS,
} from "./user.constants.js";

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
            message: USER_ERROR_MESSAGES.USER_NOT_FOUND,
        });
    }

    const isValidPassword = await dbUser.comparePassword(password);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: USER_ERROR_MESSAGES.INCORRECT_PASSWORD,
        });
    }

    if (dbUser.email === newEmail) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: USER_ERROR_MESSAGES.EMAIL_MUST_BE_DIFFERENT,
        });
    }

    const existingUser = await userRepository.findUserByEmail(newEmail);

    if (existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: USER_ERROR_MESSAGES.EMAIL_ALREADY_IN_USE,
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
        await userEmail.sendEmailUpdateRequestEmail({
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
        tokenField: USER_TOKEN_FIELDS.EMAIL_CHANGE.token,
        expiryField: USER_TOKEN_FIELDS.EMAIL_CHANGE.expiry,
        hashedToken,
    }).select("+pendingEmail");

    if (!dbUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: USER_ERROR_MESSAGES.INVALID_OR_EXPIRED_VERIFICATION_LINK,
        });
    }

    if (!dbUser._id.equals(user._id)) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        });
    }

    if (!dbUser.pendingEmail) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: USER_ERROR_MESSAGES.EMAIL_CHANGE_REQUEST_NOT_FOUND,
        });
    }

    dbUser.email = dbUser.pendingEmail;

    dbUser.pendingEmail = null;
    dbUser.emailChangeToken = null;
    dbUser.emailChangeTokenExpiry = null;

    dbUser.refreshToken = null;

    await userRepository.saveUser(dbUser);

    try {
        await userEmail.sendEmailUpdateConfirmEmail({
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
            message: USER_ERROR_MESSAGES.USER_NOT_FOUND,
        });
    }

    if (dbUser.role === ROLES.INSTRUCTOR) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: USER_ERROR_MESSAGES.ALREADY_INSTRUCTOR,
        });
    }

    const { token, hashedToken } = generateSecureTokens();

    dbUser.instructorAccessToken = hashedToken;
    dbUser.instructorAccessTokenExpiry = getTokenExpiry(
        EMAIL_EXPIRY_MINUTES.INSTRUCTOR_ACCESS_TOKEN_EXPIRY
    );

    await userRepository.saveUser(dbUser);

    try {
        await userEmail.sendInstructorAccessRequestEmail({
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
        tokenField: USER_TOKEN_FIELDS.INSTRUCTOR_ACCESS.token,
        expiryField: USER_TOKEN_FIELDS.INSTRUCTOR_ACCESS.expiry,
        hashedToken,
    });

    if (!dbUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: USER_ERROR_MESSAGES.INVALID_OR_EXPIRED_VERIFICATION_LINK,
        });
    }

    if (!dbUser._id.equals(user._id)) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        });
    }

    if (dbUser.role === ROLES.INSTRUCTOR) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: USER_ERROR_MESSAGES.ALREADY_INSTRUCTOR,
        });
    }

    dbUser.role = ROLES.INSTRUCTOR;

    dbUser.instructorAccessToken = null;
    dbUser.instructorAccessTokenExpiry = null;

    await userRepository.saveUser(dbUser);

    try {
        await userEmail.sendInstructorAccessConfirmEmail({
            email: dbUser.email,
            username: dbUser.username,
            // TODO: add action url
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

    if (!instructor || instructor.role !== ROLES.INSTRUCTOR) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: USER_ERROR_MESSAGES.USER_NOT_FOUND,
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
            message: USER_ERROR_MESSAGES.USER_NOT_FOUND,
        });
    }

    const isValidPassword = await dbUser.comparePassword(password);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: USER_ERROR_MESSAGES.INCORRECT_PASSWORD,
        });
    }

    const { otp, hashedOtp } = generateSecureOtp();

    dbUser.accountDeactivationOtp = hashedOtp;

    dbUser.accountDeactivationOtpExpiry = getTokenExpiry(
        EMAIL_EXPIRY_MINUTES.ACCOUNT_DEACTIVATION_OTP_EXPIRY
    );

    await userRepository.saveUser(dbUser);

    try {
        await userEmail.sendAccountDeactivationRequestEmail({
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
            message: USER_ERROR_MESSAGES.USER_NOT_FOUND,
        });
    }

    if (
        !dbUser.accountDeactivationOtp ||
        dbUser.accountDeactivationOtp !== hashedOtp ||
        dbUser.accountDeactivationOtpExpiry < new Date()
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: USER_ERROR_MESSAGES.INVALID_OR_EXPIRED_VERIFICATION_CODE,
        });
    }

    dbUser.isActive = false;

    dbUser.refreshToken = null;

    dbUser.accountDeactivationOtp = null;
    dbUser.accountDeactivationOtpExpiry = null;

    await userRepository.saveUser(dbUser);

    try {
        await userEmail.sendAccountDeactivationConfirmEmail({
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
