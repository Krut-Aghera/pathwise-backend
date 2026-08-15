import requireEnv from "../../utils/env-validator.utility.js";

export const AUTH_EMAIL_SUBJECTS = Object.freeze({
    REGISTRATION: "Welcome to Pathwise LMS",

    EMAIL_VERIFICATION_REQUEST: "Verify your Pathwise account",
    EMAIL_VERIFICATION_CONFIRM: "Email verified successfully",

    PASSWORD_RESET_REQUEST: "Reset your Pathwise password",
    PASSWORD_RESET_CONFIRM: "Password reset successful",

    PASSWORD_CHANGED: "Your Pathwise password has been changed",
});

export const USER_EMAIL_SUBJECTS = Object.freeze({
    EMAIL_UPDATE_REQUEST: "Update your Pathwise email",
    EMAIL_UPDATE_CONFIRM: "Email updated successfully",

    INSTRUCTOR_ACCESS_REQUEST: "Instructor access request",
    INSTRUCTOR_ACCESS_CONFIRM: "Instructor access approved",

    ACCOUNT_DEACTIVATION_REQUEST: "Deactivate your Pathwise account",
    ACCOUNT_DEACTIVATION_CONFIRM: "Account deactivated successfully",
});

export const EMAIL_SUBJECTS = {
    COURSE_ENROLLMENT: "Course enrollment successful",
};

export const EMAIL_EXPIRY_MINUTES = {
    VERIFICATION_TOKEN_EXPIRY: 5,
    CHANGE_EMAIL_TOKEN_EXPIRY: 5,
    PASSWORD_RESET_TOKEN_EXPIRY: 5,
    INSTRUCTOR_ACCESS_TOKEN_EXPIRY: 5,
    ACCOUNT_DEACTIVATION_OTP_EXPIRY: 5,
};
