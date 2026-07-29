import { body, query } from "express-validator";
import { param } from "express-validator";

import {
    COURSE_LANGUAGES,
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS_ARRAY,
    COURSE_SORT_FIELDS,
    SORT_ORDERS_ARRAY,
} from "./course.constants.js";

// course.validators.js

const titleValidator = body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 5, max: 120 })
    .withMessage("Title must be between 5 and 120 characters");

const subtitleValidator = body("subtitle")
    .trim()
    .notEmpty()
    .withMessage("Subtitle is required")
    .isLength({ max: 180 })
    .withMessage("Subtitle cannot exceed 180 characters");

const descriptionValidator = body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ max: 10000 })
    .withMessage("Description must be between 20 and 10000 characters");

const priceValidator = body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0");

const languageValidator = body("language")
    .notEmpty()
    .withMessage("Language is required")
    .bail()
    .isIn(COURSE_LANGUAGES_ARRAY)
    .withMessage(
        `Language must be one of: ${COURSE_LANGUAGES_ARRAY.join(", ")}`
    );

const levelValidator = body("level")
    .notEmpty()
    .withMessage("Level is required")
    .bail()
    .isIn(COURSE_LEVELS_ARRAY)
    .withMessage(`Level must be one of: ${COURSE_LEVELS_ARRAY.join(", ")}`);

const learningOutcomesValidator = body("learningOutcomes")
    .isArray({ max: 20 })
    .withMessage("Learning outcomes must be an array with at most 20 items");

const learningOutcomeItemsValidator = body("learningOutcomes.*")
    .trim()
    .notEmpty()
    .withMessage("Learning outcome cannot be empty")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Learning outcome cannot exceed 200 characters");

const targetAudienceValidator = body("targetAudience")
    .isArray({ max: 20 })
    .withMessage("Target audience must be an array with at most 20 items");

const targetAudienceItemsValidator = body("targetAudience.*")
    .trim()
    .notEmpty()
    .withMessage("Target audience item cannot be empty")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Target audience item cannot exceed 200 characters");

const requirementsValidator = body("requirements")
    .isArray({ max: 20 })
    .withMessage("Target audience must be an array with at most 20 items");

const requirementItemsValidator = body("requirements.*")
    .trim()
    .notEmpty()
    .withMessage("Target audience item cannot be empty")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Target audience item cannot exceed 200 characters");

export const fetchCoursesValidator = [
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
        .isIn(COURSE_LANGUAGES)
        .withMessage("Invalid course language."),
];

export const fetchInstructorCoursesValidator = [
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

export const createCourse = [
    titleValidator,
    subtitleValidator,
    descriptionValidator,
    priceValidator,
    languageValidator,
    levelValidator,
    learningOutcomesValidator,
    learningOutcomeItemsValidator,
    requirementsValidator,
    requirementItemsValidator,
    targetAudienceValidator,
    targetAudienceItemsValidator,
];

export const updateCourse = [
    titleValidator,
    subtitleValidator,
    descriptionValidator,
    priceValidator,
    languageValidator,
    levelValidator,
    learningOutcomesValidator,
    learningOutcomeItemsValidator,
    requirementsValidator,
    requirementItemsValidator,
    targetAudienceValidator,
    targetAudienceItemsValidator,
];
