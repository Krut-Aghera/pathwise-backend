import sendEmail from "../email.provider.js";
import renderEmail from "../email.renderer.js";
import * as userEmailTemplates from "../../../templates/mails/user-mailTemplates/user-email.index.js";
import { USER_EMAIL_SUBJECTS } from "../email.constans.js";

///////////////////////////////////////////////////////////////
// email update request email
const sendEmailUpdateRequestEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(
        userEmailTemplates.EmailChangeRequestEmail({
            username,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: USER_EMAIL_SUBJECTS.EMAIL_UPDATE_REQUEST,
        html,
    });
};

///////////////////////////////////////////////////////////////
// email update confirmation email
const sendEmailUpdateConfirmEmail = async ({ email, username }) => {
    const html = await renderEmail(
        userEmailTemplates.EmailChangedConfirmEmail({
            username,
        })
    );

    return sendEmail({
        to: email,
        subject: USER_EMAIL_SUBJECTS.EMAIL_UPDATE_CONFIRM,
        html,
    });
};

///////////////////////////////////////////////////////////////
// instructor access request email
const sendInstructorAccessRequestEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        userEmailTemplates.InstructorAccessRequestEmail({
            username,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: USER_EMAIL_SUBJECTS.INSTRUCTOR_ACCESS_REQUEST,
        html,
    });
};

///////////////////////////////////////////////////////////////
// instructor access confirmation email
const sendInstructorAccessConfirmEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        userEmailTemplates.InstructorAccessConfirmEmail({
            username,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: USER_EMAIL_SUBJECTS.INSTRUCTOR_ACCESS_CONFIRM,
        html,
    });
};

///////////////////////////////////////////////////////////////
// account deactivation request email
const sendAccountDeactivationRequestEmail = async ({
    email,
    username,
    otp,
}) => {
    const html = await renderEmail(
        userEmailTemplates.AccountDeactivationRequestEmail({
            username,
            otp,
        })
    );

    return sendEmail({
        to: email,
        subject: USER_EMAIL_SUBJECTS.ACCOUNT_DEACTIVATION_REQUEST,
        html,
    });
};

///////////////////////////////////////////////////////////////
// account deactivation confirmation email
const sendAccountDeactivationConfirmEmail = async ({ email, username }) => {
    const html = await renderEmail(
        userEmailTemplates.AccountDeactivationConfirmEmail({
            username,
        })
    );

    return sendEmail({
        to: email,
        subject: USER_EMAIL_SUBJECTS.ACCOUNT_DEACTIVATION_CONFIRM,
        html,
    });
};

///////////////////////////////////////////////////////////////
// exports
export {
    sendEmailUpdateRequestEmail,
    sendEmailUpdateConfirmEmail,
    sendInstructorAccessRequestEmail,
    sendInstructorAccessConfirmEmail,
    sendAccountDeactivationRequestEmail,
    sendAccountDeactivationConfirmEmail,
};
