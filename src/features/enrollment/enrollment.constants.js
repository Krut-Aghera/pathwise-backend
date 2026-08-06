///////////////////////////////////////////////////////////////
// enrollment success messages

const ENROLLMENT_SUCCESS_MESSAGES = {
    CREATED: "Enrollment has been created.",
    FETCHED: "Enrollment has been fetched.",
    FETCHED_ALL: "Enrollments have been fetched.",
    DELETED: "Enrollment has been removed.",
};

///////////////////////////////////////////////////////////////
// enrollment error messages

const ENROLLMENT_ERROR_MESSAGES = {
    NOT_FOUND: "Enrollment not found.",
    ALREADY_ENROLLED: "You are already enrolled in this course.",
    NOT_ENROLLED: "You are not enrolled in this course.",
    COURSE_NOT_AVAILABLE: "This course is not available for enrollment.",
};

///////////////////////////////////////////////////////////////
// exports

export {
    ENROLLMENT_SUCCESS_MESSAGES,
    ENROLLMENT_ERROR_MESSAGES
}