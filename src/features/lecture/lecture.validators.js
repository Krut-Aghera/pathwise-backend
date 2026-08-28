import { body } from "express-validator";

///////////////////////////////////////////////////////////////
// reusable validators

const titleValidations = body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters");

const descriptionValidations = body("description")
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage("Description cannot exceed 3000 characters");

const isPreviewFreeValidations = body("isPreviewFree")
    .isBoolean()
    .withMessage("isPreviewFree must be a boolean value")
    .toBoolean();

///////////////////////////////////////////////////////////////
// create lecture validators

const createLectureValidators = [
    titleValidations,
    descriptionValidations,
    isPreviewFreeValidations,
];

///////////////////////////////////////////////////////////////
// update lecture validators

const updateLectureValidators = [
    titleValidations,
    descriptionValidations,
    isPreviewFreeValidations,
];

///////////////////////////////////////////////////////////////
// exports

export { createLectureValidators, updateLectureValidators };
