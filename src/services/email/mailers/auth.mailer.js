import sendEmail from "../email.provider.js";
import renderEmail from "../email.renderer.js";
import * as authEmailTemplates from "../../../templates/mails/auth/auth-email.index.js";
import { AUTH_EMAIL_SUBJECTS } from "../email.constans.js";

///////////////////////////////////////////////////////////////
// Registration email

const sendRegistrationEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(
        authEmailTemplates.RegistrationEmail({ username, actionUrl })
    );

    return sendEmail({
        to: email,
        subject: AUTH_EMAIL_SUBJECTS.REGISTRATION,
        html,
    });
};

///////////////////////////////////////////////////////////////
// email verification request email

const sendEmailVerificationRequestEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        authEmailTemplates.EmailVerificationRequestEmail({
            username,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: AUTH_EMAIL_SUBJECTS.EMAIL_VERIFICATION_REQUEST,
        html,
    });
};

///////////////////////////////////////////////////////////////
// email verification confirmation email

const sendEmailVerificationConfirmEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        authEmailTemplates.EmailVerificationConfirmEmail({
            username,
            actionUrl,
        })
    );

    return sendEmail({
        to: email,
        subject: AUTH_EMAIL_SUBJECTS.EMAIL_VERIFICATION_CONFIRM,
        html,
    });
};

///////////////////////////////////////////////////////////////
// password reset request email

const sendPasswordResetRequestEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        authEmailTemplates.PasswordResetRequestEmail({ username, actionUrl })
    );

    return sendEmail({
        to: email,
        subject: AUTH_EMAIL_SUBJECTS.PASSWORD_RESET_REQUEST,
        html,
    });
};

///////////////////////////////////////////////////////////////
// password reset confirm email

const sendPasswordResetConfirmEmail = async ({
    email,
    username,
    actionUrl,
}) => {
    const html = await renderEmail(
        authEmailTemplates.PasswordResetConfirmEmail({ username, actionUrl })
    );

    return sendEmail({
        to: email,
        subject: AUTH_EMAIL_SUBJECTS.PASSWORD_RESET_CONFIRM,
        html,
    });
};

///////////////////////////////////////////////////////////////
// password changed email

const sendPasswordChangedEmail = async ({ email, username, actionUrl }) => {
    const html = await renderEmail(
        authEmailTemplates.PasswordChangedEmail({ username, actionUrl })
    );

    return sendEmail({
        to: email,
        subject: AUTH_EMAIL_SUBJECTS.PASSWORD_CHANGED,
        html,
    });
};

///////////////////////////////////////////////////////////////
// exports

export {
    sendRegistrationEmail,
    sendEmailVerificationRequestEmail,
    sendEmailVerificationConfirmEmail,
    sendPasswordResetRequestEmail,
    sendPasswordResetConfirmEmail,
    sendPasswordChangedEmail,
};
