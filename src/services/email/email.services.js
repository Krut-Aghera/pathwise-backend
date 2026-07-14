import renderEmail from "./email.renderer.js";
import sendEmail from "./email.provider.js";

import { EMAIL_SUBJECTS } from "../../constants/email-constans.js";

import WelcomeEmail from "../../Templates/mails/WelcomeEmail.jsx";
import VerifyEmail from "../../Templates/mails/VerifyEmail.jsx";
import EmailChangeVerificationEmail from "../../Templates/mails/EmailChangeVerificationEmail.jsx";
import EmailChangedSuccessfullyEmail from "../../Templates/mails/EmailChangedSuccessfullyEmail.jsx";
import AccountDeactivationOtpEmail from "../../Templates/mails/AccountDeactivationOtpEmail.jsx";
import AccountDeactivatedEmail from "../../Templates/mails/AccountDeactivatedEmail.jsx";
import EmailVerifiedEmail from "../../Templates/mails/EmailVerifiedEmail.jsx";
import ResetPasswordEmail from "../../Templates/mails/ResetPasswordEmail.jsx";
import PasswordResetSuccessEmail from "../../Templates/mails/PasswordResetSuccessEmail.jsx";
import CourseEnrollmentEmail from "../../Templates/mails/CourseEnrollmentEmail.jsx";

///////////////////////////////////////////////////////////////
// welcome email
/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - CTA button URL.
 */
const sendWelcomeEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(WelcomeEmail({ username, actionUrl }));

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.WELCOME,
        html,
    });
};

///////////////////////////////////////////////////////////////
// email verification email
/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - Email verification URL.
 */
const sendVerificationEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(VerifyEmail({ username, actionUrl }));

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.VERIFY_EMAIL,
        html,
    });
};

///////////////////////////////////////////////////////////////
// email verified confirmation
/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - CTA button URL.
 */

const sendEmailVerifiedEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(EmailVerifiedEmail({ username, actionUrl }));

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.EMAIL_VERIFIED,
        html,
    });
};

///////////////////////////////////////////////////////////////
// password reset email
/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - Password reset URL.
 */
const sendPasswordResetEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(ResetPasswordEmail({ username, actionUrl }));

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.RESET_PASSWORD,
        html,
    });
};

///////////////////////////////////////////////////////////////
// password reset success email
/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - CTA button URL.
 */
const sendPasswordResetSuccessEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        PasswordResetSuccessEmail({ username, actionUrl })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.PASSWORD_RESET_SUCCESS,
        html,
    });
};

///////////////////////////////////////////////////////////////
// course enrollment confirmation email
/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - Student's name.
 * @param {string} params.courseName - Course title.
 * @param {string} params.instructorName - Instructor's name.
 * @param {string} params.actionUrl - Course access URL.
 */
const sendCourseEnrollmentEmail = async ({
    email,
    username,
    courseName,
    instructorName,
    actionUrl,
}) => {
    const html = await renderEmail(
        CourseEnrollmentEmail({
            username,
            courseName,
            instructorName,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.COURSE_ENROLLMENT,
        html,
    });
};

///////////////////////////////////////////////////////////////
// email change verification email

/**
 * @param {Object} params
 * @param {string} params.email - Recipient's new email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - Email change verification URL.
 */
const sendEmailChangeVerificationEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        EmailChangeVerificationEmail({
            username,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.EMAIL_CHANGE_VERIFICATION,
        html,
    });
};

///////////////////////////////////////////////////////////////
// email changed successfully email

/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 */
const sendEmailChangedSuccessfullyEmail = async ({ email, username }) => {
    const html = await renderEmail(
        EmailChangedSuccessfullyEmail({
            username,
        })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.EMAIL_CHANGED_SUCCESSFULLY,
        html,
    });
};

///////////////////////////////////////////////////////////////
// account deactivation OTP email

/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.otp - Six-digit verification code.
 */
const sendAccountDeactivationOtpEmail = async ({ email, username, otp }) => {
    const html = await renderEmail(
        AccountDeactivationOtpEmail({
            username,
            otp,
        })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.ACCOUNT_DEACTIVATION_OTP,
        html,
    });
};

///////////////////////////////////////////////////////////////
// account deactivated confirmation email

/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 */
const sendAccountDeactivatedEmail = async ({ email, username }) => {
    const html = await renderEmail(
        AccountDeactivatedEmail({
            username,
        })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.ACCOUNT_DEACTIVATED,
        html,
    });
};

///////////////////////////////////////////////////////////////
// exports

export {
    sendWelcomeEmail,
    sendVerificationEmail,
    sendEmailVerifiedEmail,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    sendEmailChangeVerificationEmail,
    sendEmailChangedSuccessfullyEmail,
    sendCourseEnrollmentEmail,
    sendAccountDeactivationOtpEmail,
    sendAccountDeactivatedEmail,
};
