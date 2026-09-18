///////////////////////////////////////////////////////////////
// user success messages

const USER_SUCCESS_MESSAGES = Object.freeze({
    FETCH_CURRENT_USER: "Current user fetched successfully.",
    UPDATE_USERNAME: "Username updated successfully.",
    FETCH_INSTRUCTOR_PROFILE: "Instructor profile fetched successfully.",

    REQUEST_EMAIL_UPDATION:
        "Verification link has been sent to your new email address.",
    CONFIRM_EMAIL_UPDATION:
        "Email address updated successfully. Please sign in again with your new email address.",

    REQUEST_INSTRUCTOR_ACCESS:
        "Verification link has been sent to your email address. Verify it to become an instructor.",
    CONFIRM_INSTRUCTOR_ACCESS: "Instructor account activated successfully.",

    REQUEST_ACCOUNT_DEACTIVATION:
        "Verification code for account deactivation has been sent to your registered email address.",
    CONFIRM_ACCOUNT_DEACTIVATION: "Account deactivated successfully.",
});

///////////////////////////////////////////////////////////////
// user error messages

const USER_ERROR_MESSAGES = Object.freeze({
    USER_NOT_FOUND: "User not found.",

    EMAIL_MUST_BE_DIFFERENT:
        "New email address must be different from your current email address.",
    EMAIL_ALREADY_IN_USE: "Email address is already in use.",
    EMAIL_CHANGE_REQUEST_NOT_FOUND: "No email change request was found.",

    INVALID_OR_EXPIRED_VERIFICATION_LINK:
        "Invalid or expired verification link.",
    INVALID_OR_EXPIRED_VERIFICATION_CODE:
        "Invalid or expired verification code. Try requesting a new one.",
    NOT_AUTHORIZED: "You are not authorized to perform this action.",

    ALREADY_INSTRUCTOR: "You already have instructor access.",
    INSTRUCTOR_PROFILE_NOT_FOUND: "Instructor profile not found.",

    CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
    INCORRECT_PASSWORD: "Incorrect password.",
});

///////////////////////////////////////////////////////////////
// user profile constants

const ROLES = Object.freeze({
    STUDENT: "student",
    INSTRUCTOR: "instructor",
    ADMIN: "admin",
});

const USER_PROFILE = Object.freeze({
    USERNAME: "username",
    EMAIL: "email",
});

const ROLES_LIST = Object.freeze(Object.values(ROLES));
const USER_PROFILE_LIST = Object.freeze(Object.keys(USER_PROFILE));

///////////////////////////////////////////////////////////////
// user token constants

const USER_TOKEN_FIELDS = Object.freeze({
    EMAIL_VERIFICATION: {
        token: "emailVerificationToken",
        expiry: "emailVerificationExpiry",
    },
    PASSWORD_RESET: {
        token: "resetPasswordToken",
        expiry: "resetPasswordExpiry",
    },
    EMAIL_CHANGE: {
        token: "emailChangeToken",
        expiry: "emailChangeTokenExpiry",
    },
    INSTRUCTOR_ACCESS: {
        token: "instructorAccessToken",
        expiry: "instructorAccessTokenExpiry",
    },
});

///////////////////////////////////////////////////////////////
// exports

export {
    ROLES,
    ROLES_LIST,
    USER_PROFILE,
    USER_PROFILE_LIST,
    USER_TOKEN_FIELDS,
    USER_ERROR_MESSAGES,
    USER_SUCCESS_MESSAGES,
};
