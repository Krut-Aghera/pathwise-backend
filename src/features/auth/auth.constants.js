///////////////////////////////////////////////////////////////
// auth success messages

const AUTH_SUCCESS_MESSAGES = Object.freeze({
    REGISTER: "Registration successful. Please verify your email.",
    EMAIL_VERIFICATION_REQUESTED: "Verification email sent successfully.",
    EMAIL_VERIFIED: "Email verified successfully.",
    
    LOGIN: "Logged in successfully.",
    LOGOUT: "Logged out successfully.",
    TOKENS_REFRESHED: "Access token refreshed successfully.",
    
    PASSWORD_RESET_REQUESTED: "Password reset link has been sent to provided email address",
    PASSWORD_RESET: "Password reset successfully.",
    PASSWORD_CHANGED: "Password changed successfully.",
});

///////////////////////////////////////////////////////////////
// auth error code

const AUTH_ERROR_CODES = Object.freeze({

    ACCESS_TOKEN_MISSING: "ACCESS_TOKEN_MISSING",
    ACCESS_TOKEN_EXPIRED: "ACCESS_TOKEN_EXPIRED",
    ACCESS_TOKEN_INVALID: "ACCESS_TOKEN_INVALID",
    ACCESS_TOKEN_NOT_ACTIVE: "ACCESS_TOKEN_NOT_ACTIVE",

})

///////////////////////////////////////////////////////////////
// auth error messages

const AUTH_ERROR_MESSAGES = Object.freeze({
    USER_NOT_FOUND: "User not found.",
    
    INVALID_CREDENTIALS: "Invalid credentials.",

    CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
    PASSWORD_MUST_BE_DIFFERENT:
    "New password must be different from the current password.",
    
    ACCOUNT_DEACTIVATED:
        "Your account has been deactivated. Please contact support.",

    INVALID_OR_EXPIRED_RESET_PASSWORD_TOKEN:
        "Reset password link is invalid or has expired. Please request a new one.",

    INVALID_OR_EXPIRED_REFRESH_TOKEN:
        "Refresh token is invalid or has expired. Please log in again.",

    INVALID_OR_EXPIRED_EMAIL_VERIFICATION_TOKEN:
        "Email verification link is invalid or has expired. Please request a new verification email.",

    EMAIL_ALREADY_VERIFIED: "Email is already verified.",

    EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
});

///////////////////////////////////////////////////////////////
// exports

export { AUTH_SUCCESS_MESSAGES, AUTH_ERROR_CODES, AUTH_ERROR_MESSAGES };
