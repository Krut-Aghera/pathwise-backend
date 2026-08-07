import { body } from "express-validator";

///////////////////////////////////////////////////////////////
// reusable validators

const titleValidations = body("title")
    .trim()
    .notEmpty()
    .withMessage("Section title is required.")
    .bail()
    .isLength({ min: 3, max: 120 })
    .withMessage("Section title must be between 3 and 120 characters.");

///////////////////////////////////////////////////////////////
// create section

const createSectionValidators = [titleValidations];

///////////////////////////////////////////////////////////////
// update section

const updateSectionValidators = [titleValidations];

///////////////////////////////////////////////////////////////
// reorder course sections validator

const reorderSectionValidators = [
    body("sections")
        .isArray({ min: 1 })
        .withMessage("Sections must be a non-empty array."),

    body("sections.*.sectionId")
        .notEmpty()
        .withMessage("Section ID is required.")
        .bail()
        .isMongoId()
        .withMessage("Invalid Section ID."),

    body("sections.*.order")
        .notEmpty()
        .withMessage("Order is required.")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Order must be a positive integer."),
];

///////////////////////////////////////////////////////////////
// exports

export {
    createSectionValidators,
    updateSectionValidators,
    reorderSectionValidators,
};
