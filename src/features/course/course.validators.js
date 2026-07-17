import { body } from "express-validator";
import {
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS_ARRAY,
} from "../../constants/course-constans.js";

export const titleValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5, max: 120 })
        .withMessage("Title must be between 5 and 120 characters"),
];

export const subtitleValidation = [
    body("subtitle")
        .optional()
        .trim()
        .isLength({ max: 180 })
        .withMessage("Subtitle cannot exceed 180 characters"),
];

export const descriptionValidation = [
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 10000 })
        .withMessage("Description cannot exceed 10000 characters"),
];

export const priceValidation = [
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to 0"),
];

export const languageValidation = [
    body("language")
        .optional()
        .isIn(COURSE_LANGUAGES_ARRAY)
        .withMessage("Invalid course language"),
];

export const levelValidation = [
    body("level")
        .optional()
        .isIn(COURSE_LEVELS_ARRAY)
        .withMessage("Invalid course level"),
];

export const learningOutcomesValidation = [
    body("learningOutcomes")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Maximum 20 learning outcomes are allowed"),

    body("learningOutcomes.*")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Learning outcome cannot be empty"),
];

export const requirementsValidation = [
    body("requirements")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Maximum 20 requirements are allowed"),

    body("requirements.*")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Requirement cannot be empty"),
];

export const targetAudienceValidation = [
    body("targetAudience")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Maximum 20 target audience items are allowed"),

    body("targetAudience.*")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Target audience item cannot be empty"),
];

export const tagsValidation = [
    body("tags")
        .optional()
        .isArray({ max: 15 })
        .withMessage("Maximum 15 tags are allowed"),

    body("tags.*")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Tag cannot be empty"),
];

export const createCourseValidation = [
    titleValidation,
    subtitleValidation,
    descriptionValidation,
    priceValidation,
    languageValidation,
    levelValidation,
    learningOutcomesValidation,
    requirementsValidation,
    targetAudienceValidation,
    tagsValidation,
];

export const updateCourseValidation = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 5, max: 120 })
        .withMessage("Title must be between 5 and 120 characters"),

    body("subtitle")
        .optional()
        .trim()
        .isLength({ max: 180 })
        .withMessage("Subtitle cannot exceed 180 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 10000 })
        .withMessage("Description cannot exceed 10000 characters"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to 0"),

    body("language")
        .optional()
        .isIn(COURSE_LANGUAGES_ARRAY)
        .withMessage("Invalid language"),

    body("level")
        .optional()
        .isIn(COURSE_LEVELS_ARRAY)
        .withMessage("Invalid level"),

    body("learningOutcomes")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Maximum 20 learning outcomes are allowed"),

    body("learningOutcomes.*").optional().trim().notEmpty(),

    body("requirements")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Maximum 20 requirements are allowed"),

    body("requirements.*").optional().trim().notEmpty(),

    body("targetAudience")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Maximum 20 target audience items are allowed"),

    body("targetAudience.*").optional().trim().notEmpty(),

    body("tags")
        .optional()
        .isArray({ max: 15 })
        .withMessage("Maximum 15 tags are allowed"),

    body("tags.*").optional().trim().notEmpty(),
];
