import renderEmail from "./email.renderer.js";
import sendEmail from "./email.provider.js";

import { EMAIL_SUBJECTS } from "./email.constans.js";

import EmailChangeVerificationEmail from "../../templates/mails/EmailChangeVerificationEmail.jsx";
import EmailChangedSuccessfullyEmail from "../../templates/mails/EmailChangedSuccessfullyEmail.jsx";
import AccountDeactivationOtpEmail from "../../templates/mails/AccountDeactivationOtpEmail.jsx";
import AccountDeactivatedEmail from "../../templates/mails/AccountDeactivatedEmail.jsx";
import CourseEnrollmentEmail from "../../templates/mails/CourseEnrollmentEmail.jsx";
import InstructorAccessVerificationEmail from "../../templates/mails/InstructorAccessVerificationEmail.jsx";
import InstructorAccessGrantedEmail from "../../templates/mails/InstructorAccessGrantedEmail.jsx";

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
// instructor access verification email

/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 * @param {string} params.actionUrl - Instructor access verification URL.
 */
const sendInstructorAccessVerificationEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        InstructorAccessVerificationEmail({
            username,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.INSTRUCTOR_ACCESS_VERIFICATION,
        html,
    });
};

///////////////////////////////////////////////////////////////
// instructor access granted email

/**
 * @param {Object} params
 * @param {string} params.email - Recipient email address.
 * @param {string} params.username - User's display name.
 */
const sendInstructorAccessGrantedEmail = async ({ email, username }) => {
    const html = await renderEmail(
        InstructorAccessGrantedEmail({
            username,
        })
    );

    return sendEmail({
        to: email,
        subject: EMAIL_SUBJECTS.INSTRUCTOR_ACCESS_GRANTED,
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
    sendEmailChangeVerificationEmail,
    sendEmailChangedSuccessfullyEmail,
    sendInstructorAccessVerificationEmail,
    sendInstructorAccessGrantedEmail,
    sendCourseEnrollmentEmail,
    sendAccountDeactivationOtpEmail,
    sendAccountDeactivatedEmail,
};
