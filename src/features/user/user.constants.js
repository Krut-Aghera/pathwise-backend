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

const USER_TOKEN_FIELDS = {
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
};

///////////////////////////////////////////////////////////////
// exports

export {
    ROLES,
    ROLES_LIST,
    USER_PROFILE,
    USER_PROFILE_LIST,
    USER_TOKEN_FIELDS,
};
