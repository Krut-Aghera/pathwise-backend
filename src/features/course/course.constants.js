///////////////////////////////////////////////////////////////
// course success messages

const COURSE_SUCCESS_MESSAGES = Object.freeze({
    COURSES_FETCHED: "Courses fetched successfully.",
    COURSE_FETCHED: "Course fetched successfully.",

    INSTRUCTOR_COURSE_FETCHED: "Instructor course fetched successfully.",
    INSTRUCTOR_COURSES_FETCHED: "Instructor courses fetched successfully.",

    COURSE_CREATED: "Course created successfully.",
    COURSE_UPDATED: "Course updated successfully.",
    COURSE_THUMBNAIL_UPDATED: "Course thumbnail updated successfully.",

    COURSE_DELETED: "Course deleted successfully.",
    COURSE_PUBLISHED: "Course published successfully.",
    COURSE_SAVED_AS_DRAFT: "Course saved as draft successfully.",
});

///////////////////////////////////////////////////////////////
// course error messages

const COURSE_ERROR_MESSAGES = Object.freeze({
    COURSE_NOT_FOUND: "Course not found.",
    COURSE_TITLE_ALREADY_EXISTS: "A course with this title already exists.",

    COURSE_ALREADY_DRAFT: "Course is already saved as draft.",
    COURSE_NOT_DRAFT: "Only a draft course can be published.",
    COURSE_NOT_ELIGIBLE_FOR_PUBLISH:
        "Course must have at least one published section before it can be published.",

    THUMBNAIL_REQUIRED: "Course thumbnail is required.",
});

///////////////////////////////////////////////////////////////
// allowed course field constants

const COURSE_ALLOWED_FIELDS = [
    "title",
    "subtitle",
    "description",
    "price",
    "language",
    "level",
    "learningOutcomes",
    "requirements",
    "targetAudience",
];

///////////////////////////////////////////////////////////////
// fetch course constants

const COURSE_FETCH_QUERY_FIELDS = [
    "page",
    "limit",
    "search",
    "sortBy",
    "sortOrder",
    "level",
    "language",
];

const COURSE_QUERY_DEFAULTS = Object.freeze({
    PAGE: 1,
    LIMIT: 12,
    SORT_BY: "createdAt",
    SORT_ORDER: "desc",
});

const COURSE_LIST_SELECT_FIELDS =
    "title subtitle thumbnail price level status language instructor slug createdAt";

///////////////////////////////////////////////////////////////
// course sorting constants

const COURSE_SORT_FIELDS = ["createdAt", "title", "price"];

const SORT_ORDERS = {
    ASC: "asc",
    DESC: "desc",
};

const SORT_ORDERS_ARRAY = Object.values(SORT_ORDERS);

///////////////////////////////////////////////////////////////
// course details constants

const COURSE_LANGUAGES = Object.freeze({
    ENGLISH: "English",
    HINDI: "Hindi",
});

const COURSE_LEVELS = Object.freeze({
    BEGINNER: "beginner",
    INTERMEDIATE: "intermediate",
    ADVANCED: "advanced",
});

const COURSE_LANGUAGES_ARRAY = Object.values(COURSE_LANGUAGES);
const COURSE_LEVELS_ARRAY = Object.values(COURSE_LEVELS);

///////////////////////////////////////////////////////////////
// exports

export {
    COURSE_SUCCESS_MESSAGES,
    COURSE_ERROR_MESSAGES,
    COURSE_ALLOWED_FIELDS,
    COURSE_FETCH_QUERY_FIELDS,
    COURSE_QUERY_DEFAULTS,
    COURSE_LIST_SELECT_FIELDS,
    COURSE_SORT_FIELDS,
    SORT_ORDERS,
    SORT_ORDERS_ARRAY,
    COURSE_LANGUAGES,
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS,
    COURSE_LEVELS_ARRAY,
};
