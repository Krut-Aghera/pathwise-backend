///////////////////////////////////////////////////////////////
// progress success messages

const PROGRESS_SUCCESS_MESSAGES = Object.freeze({
    FETCHED: "Course progress fetched successfully.",
    UPDATED: "Lecture progress updated successfully.",
    COMPLETED: "Lecture completed successfully.",
});

///////////////////////////////////////////////////////////////
// progress error messages

const PROGRESS_ERROR_MESSAGES = Object.freeze({
    PROGRESS_NOT_FOUND: "Progress not found.",

    COURSE_NOT_FOUND: "Course not found.",
    COURSE_NOT_ENROLLED: "You are not enrolled in this course.",

    LECTURE_NOT_FOUND: "Lecture not found.",
    LECTURE_NOT_IN_COURSE: "Lecture does not belong to this course.",

    LECTURE_PROGRESS_NOT_FOUND: "Lecture progress not found.",

    LECTURE_ALREADY_COMPLETED: "Lecture has already been completed.",

    INVALID_PROGRESS: "Invalid lecture progress.",

    INVALID_LAST_POSITION: "Last position cannot exceed lecture duration.",
    INVALID_WATCHED_DURATION:
        "Watched duration cannot exceed lecture duration.",

    LECTURE_NOT_COMPLETED:
        "Lecture has not reached the required completion threshold.",
});

///////////////////////////////////////////////////////////////
// progress status

const PROGRESS_STATUS = Object.freeze({
    NOT_STARTED: "NOT STARTED",
    IN_PROGRESS: "IN PROGRESS",
    COMPLETED: "COMPLETED",
});

//////////////////////////////////////////////////////////////
// progress configuration

const PROGRESS_CONFIG = Object.freeze({
    LECTURE_COMPLETION_PERCENTAGE: 90,
});

////////////////////////////////////////////////////////////////
// lecture progress update fields

const LECTURE_PROGRESS_UPDATE_FIELDS = Object.freeze([
    "lastPosition",
    "watchedDuration",
]);

//////////////////////////////////////////////////////////////
// exports

export {
    PROGRESS_SUCCESS_MESSAGES,
    PROGRESS_ERROR_MESSAGES,
    PROGRESS_STATUS,
    PROGRESS_CONFIG,
    LECTURE_PROGRESS_UPDATE_FIELDS
};
