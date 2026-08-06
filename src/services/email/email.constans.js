import requireEnv from "../../utils/env-validator.utility.js";

export const AUTH_EMAIL_SUBJECTS = {
    REGISTRATION: "Welcome to Pathwise LMS",

    EMAIL_VERIFICATION_REQUEST: "Verify your Pathwise account",
    EMAIL_VERIFICATION_CONFIRM: "Email verified successfully",

    PASSWORD_RESET_REQUEST: "Reset your Pathwise password",
    PASSWORD_RESET_CONFIRM: "Password reset successful",

    PASSWORD_CHANGED: "Your Pathwise password has been changed",
};

export const EMAIL_SUBJECTS = {
    EMAIL_CHANGE_VERIFICATION: "Confirm your new email address",
    EMAIL_CHANGED_SUCCESSFULLY: "Email address updated successfully",
    INSTRUCTOR_ACCESS_VERIFICATION: "Verify your instructor access request",
    INSTRUCTOR_ACCESS_GRANTED: "Instructor access granted",
    COURSE_ENROLLMENT: "Course enrollment successful",
    ACCOUNT_DEACTIVATION_OTP: "Confirm Your Pathwise Account Deactivation",
    ACCOUNT_DEACTIVATED: "Your Pathwise Account Has Been Deactivated",
};

export const EMAIL_EXPIRY_MINUTES = {
    VERIFICATION_TOKEN_EXPIRY: 5,
    CHANGE_EMAIL_TOKEN_EXPIRY: 5,
    PASSWORD_RESET_TOKEN_EXPIRY: 5,
    INSTRUCTOR_ACCESS_TOKEN_EXPIRY: 5,
    ACCOUNT_DEACTIVATION_OTP_EXPIRY: 5,
};

export const EMAIL_ENV = Object.freeze({
    EMAIL_LOGO_URL: requireEnv("EMAIL_LOGO_URL"),

    MAILTRAP_API_TOKEN: requireEnv("MAILTRAP_API_TOKEN"),
    MAILTRAP_SANDBOX_ID: requireEnv("MAILTRAP_SANDBOX_ID"),
    MAILTRAP_SENDER_EMAIL: requireEnv("MAILTRAP_SENDER_EMAIL"),
    MAILTRAP_SENDER_NAME: requireEnv("MAILTRAP_SENDER_NAME"),
});
