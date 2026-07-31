import { body } from "express-validator";

//
//
///////////////////////////////////////////////////////////////
// reusable validators
//
//

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

const orderValidations = body("order")
    .notEmpty()
    .withMessage("Order is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer");

const isPreviewFreeValidations = body("isPreviewFree")
    .optional()
    .isBoolean()
    .withMessage("isPreviewFree must be a boolean value")
    .toBoolean();

//
//
///////////////////////////////////////////////////////////////
// create lecture validators
//
//

const createLectureValidators = [
    titleValidations,
    descriptionValidations,
    orderValidations,
    isPreviewFreeValidations,
];

//
//
///////////////////////////////////////////////////////////////
// update lecture validators
//
//

const updateLectureValidators = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .bail()
        .isLength({ min: 3, max: 150 })
        .withMessage("Title must be between 3 and 150 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 3000 })
        .withMessage("Description cannot exceed 3000 characters"),

    body("order")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Order must be a positive integer")
        .toInt(),

    body("isPreviewFree")
        .optional()
        .isBoolean()
        .withMessage("isPreviewFree must be a boolean value")
        .toBoolean(),
];

///////////////////////////////////////////////////////////////
// exports

export { createLectureValidators, updateLectureValidators };
