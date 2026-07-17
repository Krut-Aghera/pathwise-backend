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

export { USER_PROFILE, USER_PROFILE_LIST, ROLES, ROLES_LIST };
