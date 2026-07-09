import renderEmail from "./email.renderer.js";
import sendEmail from "./email.provider.js";

import { EMAIL_SUBJECTS } from "../../constants/email.constants.js";

import {
    VerifyEmail,
    WelcomeEmail,
    EmailVerifiedEmail,
    ResetPasswordEmail,
    PasswordResetSuccessEmail,
    CourseEnrollmentEmail,
} from "../../templates/index.js";

///////////////////////////////////////////////////////////////
// welcome email
/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - CTA button URL.
 */
const sendWelcomeEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(
        <WelcomeEmail username={username} actionUrl={actionUrl} />
    );

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
    const html = await renderEmail(
        <VerifyEmail username={username} actionUrl={actionUrl} />
    );

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
    const html = await renderEmail(
        <EmailVerifiedEmail username={username} actionUrl={actionUrl} />
    );

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
    const html = await renderEmail(
        <ResetPasswordEmail username={username} actionUrl={actionUrl} />
    );

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
        <PasswordResetSuccessEmail username={username} actionUrl={actionUrl} />
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
        <CourseEnrollmentEmail
            username={username}
            courseName={courseName}
            instructorName={instructorName}
            actionUrl={actionUrl}
        />
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.COURSE_ENROLLMENT,
        html,
    });
};

export {
    sendWelcomeEmail,
    sendVerificationEmail,
    sendEmailVerifiedEmail,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    sendCourseEnrollmentEmail,
};
