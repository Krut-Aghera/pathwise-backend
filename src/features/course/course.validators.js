import { body } from "express-validator";
import {
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS_ARRAY,
    COURSE_STATUS_ARRAY,
} from "./course.constans.js";

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

const statusValidator = body("status")
    .notEmpty()
    .withMessage("Status is required")
    .bail()
    .isIn(COURSE_STATUS_ARRAY)
    .withMessage(`Level must be one of: ${COURSE_STATUS_ARRAY.join(", ")}`);

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

export const createCourse = [
    titleValidator,
    subtitleValidator,
    descriptionValidator,
    priceValidator,
    languageValidator,
    levelValidator,
    statusValidator,
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
