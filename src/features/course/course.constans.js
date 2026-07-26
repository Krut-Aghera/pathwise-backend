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

const COURSE_SORT_FIELDS = ["createdAt", "title", "price"];

const COURSE_LIST_SELECT_FIELDS =
    "title subtitle thumbnail price level language instructor slug createdAt";

const SORT_ORDERS = {
    ASC: "asc",
    DESC: "desc",
};

const COURSE_LANGUAGES = Object.freeze({
    ENGLISH: "english",
    HINDI: "hindi",
});

const COURSE_LEVELS = Object.freeze({
    BEGINNER: "beginner",
    INTERMEDIATE: "intermediate",
    ADVANCED: "advanced",
});

const COURSE_STATUS = Object.freeze({
    DRAFT: "draft",
    PUBLISHED: "published",
});

const COURSE_LANGUAGES_ARRAY = Object.values(COURSE_LANGUAGES);
const COURSE_LEVELS_ARRAY = Object.values(COURSE_LEVELS);
const COURSE_STATUS_ARRAY = Object.values(COURSE_STATUS);
const SORT_ORDERS_ARRAY = Object.values(SORT_ORDERS);

export {
    COURSE_ALLOWED_FIELDS,
    COURSE_LANGUAGES,
    COURSE_LEVELS,
    COURSE_STATUS,
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS_ARRAY,
    COURSE_STATUS_ARRAY,
    SORT_ORDERS_ARRAY,
    COURSE_SORT_FIELDS,
    SORT_ORDERS,
    COURSE_FETCH_QUERY_FIELDS,
    COURSE_QUERY_DEFAULTS,
    COURSE_LIST_SELECT_FIELDS,
};
