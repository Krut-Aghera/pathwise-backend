import requireEnv from "../../utils/env-validator.utility";

export const EMAIL_SUBJECTS = {
    VERIFY_EMAIL: "Verify your Pathwise account",
    WELCOME: "Welcome to Pathwise LMS",
    RESET_PASSWORD: "Reset your password",
    PASSWORD_RESET_SUCCESS: "Password reset successful",
    EMAIL_VERIFIED: "Email verified successfully",
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
