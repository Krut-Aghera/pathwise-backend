const COURSE_ALLOWED_FIELDS = [
    "instructor",
    "title",
    "subtitle",
    "slug",
    "description",
    "price",
    "language",
    "level",
    "learningOutcomes",
    "requirements",
    "targetAudience",
    "status",
];

const COURSE_LANGUAGES = Object.freeze({
    ENGLISH: "english",
    HINDI: "hindi",
});

const COURSE_LEVELS = Object.freeze({
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
});

const COURSE_STATUS = Object.freeze({
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
});

const COURSE_LANGUAGES_ARRAY = Object.values(COURSE_LANGUAGES);
const COURSE_LEVELS_ARRAY = Object.values(COURSE_LEVELS);
const COURSE_STATUS_ARRAY = Object.values(COURSE_STATUS);

export {
    COURSE_ALLOWED_FIELDS,
    COURSE_LANGUAGES,
    COURSE_LEVELS,
    COURSE_STATUS,
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS_ARRAY,
    COURSE_STATUS_ARRAY,
};
