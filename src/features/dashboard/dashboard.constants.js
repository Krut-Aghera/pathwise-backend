///////////////////////////////////////////////////////////////
// dashboard success messages

const DASHBOARD_SUCCESS_MESSAGES = Object.freeze({
    INSTRUCTOR_DASHBOARD_FETCHED: "Instructor dashboard fetched successfully.",
    STUDENT_DASHBOARD_FETCHED: "Student dashboard fetched successfully.",
    ADMIN_DASHBOARD_FETCHED: "Admin dashboard fetched successfully.",
});

///////////////////////////////////////////////////////////////
// dashboard error messages

const DASHBOARD_ERROR_MESSAGES = Object.freeze({
    INSTRUCTOR_DASHBOARD_ACCESS_DENIED:
        "You are not authorized to access this instructor dashboard.",

    STUDENT_DASHBOARD_ACCESS_DENIED:
        "You are not authorized to access this student dashboard.",

    ADMIN_DASHBOARD_ACCESS_DENIED:
        "You are not authorized to access this admin dashboard.",
});

///////////////////////////////////////////////////////////////
// exports

export { DASHBOARD_SUCCESS_MESSAGES, DASHBOARD_ERROR_MESSAGES };
