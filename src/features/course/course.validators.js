import { body, query } from "express-validator";
import {
    COURSE_LANGUAGES,
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS_ARRAY,
    COURSE_SORT_FIELDS,
    SORT_ORDERS_ARRAY,
} from "./course.constants.js";

///////////////////////////////////////////////////////////////
// Reusable sanitizers

const parseArrayField = (value) => {
    if (typeof value !== "string") {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

///////////////////////////////////////////////////////////////
// Reusable validators

const titleValidations = body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 5, max: 120 })
    .withMessage("Title must be between 5 and 120 characters");

const subtitleValidations = body("subtitle")
    .trim()
    .notEmpty()
    .withMessage("Subtitle is required")
    .bail()
    .isLength({ max: 180 })
    .withMessage("Subtitle cannot exceed 180 characters");

const descriptionValidations = body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ min: 20, max: 10000 })
    .withMessage("Description must be between 20 and 10000 characters");

const priceValidations = body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0");

const languageValidations = body("language")
    .notEmpty()
    .withMessage("Language is required")
    .bail()
    .isIn(COURSE_LANGUAGES_ARRAY)
    .withMessage(
        `Language must be one of: ${COURSE_LANGUAGES_ARRAY.join(", ")}`
    );

const levelValidations = body("level")
    .notEmpty()
    .withMessage("Level is required")
    .bail()
    .isIn(COURSE_LEVELS_ARRAY)
    .withMessage(`Level must be one of: ${COURSE_LEVELS_ARRAY.join(", ")}`);

///////////////////////////////////////////////////////////////
// Learning outcomes

const learningOutcomesValidations = body("learningOutcomes")
    .customSanitizer(parseArrayField)
    .isArray({ min: 1, max: 10 })
    .withMessage(
        "Learning outcomes must be an array with between 1 and 10 items"
    )
    .bail();

const learningOutcomeItemsValidations = body("learningOutcomes.*")
    .trim()
    .notEmpty()
    .withMessage("Learning outcome cannot be empty")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Learning outcome cannot exceed 200 characters");

///////////////////////////////////////////////////////////////
// Target audience

const targetAudienceValidations = body("targetAudience")
    .customSanitizer(parseArrayField)
    .isArray({ min: 1, max: 10 })
    .withMessage("Target audience must be an array with between 1 and 10 items")
    .bail();

const targetAudienceItemsValidations = body("targetAudience.*")
    .trim()
    .notEmpty()
    .withMessage("Target audience item cannot be empty")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Target audience item cannot exceed 200 characters");

///////////////////////////////////////////////////////////////
// Requirements

const requirementsValidations = body("requirements")
    .customSanitizer(parseArrayField)
    .isArray({ min: 1, max: 10 })
    .withMessage("Requirements must be an array with between 1 and 10 items")
    .bail();

const requirementItemsValidations = body("requirements.*")
    .trim()
    .notEmpty()
    .withMessage("Requirement cannot be empty")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Requirement cannot exceed 200 characters");

//
//
///////////////////////////////////////////////////////////////
// fetch courses validator
//
//

const fetchCoursesValidators = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer.")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100.")
        .toInt(),

    query("search").optional().trim().isLength({ max: 100 }),

    query("sortBy")
        .optional()
        .isIn(COURSE_SORT_FIELDS)
        .withMessage("Invalid sort field."),

    query("sortOrder")
        .optional()
        .isIn(SORT_ORDERS_ARRAY)
        .withMessage("Sort order must be either 'asc' or 'desc'."),

    query("level")
        .optional()
        .isIn(COURSE_LEVELS_ARRAY)
        .withMessage("Invalid course level."),

    query("language")
        .optional()
        .isIn(COURSE_LANGUAGES_ARRAY)
        .withMessage("Invalid course language."),
];

//
//
///////////////////////////////////////////////////////////////
// fetch instructor courses validator
//
//

const fetchInstructorCoursesValidators = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer.")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100.")
        .toInt(),
];

//
//
///////////////////////////////////////////////////////////////
// create course validators
//
//

const createCourseValidators = [
    titleValidations,
    subtitleValidations,
    descriptionValidations,
    priceValidations,
    languageValidations,
    levelValidations,
    learningOutcomesValidations,
    learningOutcomeItemsValidations,
    requirementsValidations,
    requirementItemsValidations,
    targetAudienceValidations,
    targetAudienceItemsValidations,
];

//
//
///////////////////////////////////////////////////////////////
// update course validators
//
//

const updateCourseValidators = [
    titleValidations,
    subtitleValidations,
    descriptionValidations,
    priceValidations,
    languageValidations,
    levelValidations,
    learningOutcomesValidations,
    learningOutcomeItemsValidations,
    requirementsValidations,
    requirementItemsValidations,
    targetAudienceValidations,
    targetAudienceItemsValidations,
];

///////////////////////////////////////////////////////////////
// exports

export {
    createCourseValidators,
    updateCourseValidators,
    fetchCoursesValidators,
    fetchInstructorCoursesValidators,
};
