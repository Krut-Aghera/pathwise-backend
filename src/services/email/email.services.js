import renderEmail from "./email.renderer.js";
import sendEmail from "./email.provider.js";

import { EMAIL_SUBJECTS } from "./email.constans.js";

import CourseEnrollmentEmail from "../../templates/mails/CourseEnrollmentEmail.jsx";

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
// exports

export { sendCourseEnrollmentEmail };
