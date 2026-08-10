import { body } from "express-validator";

///////////////////////////////////////////////////////////////
// create order validator

const courseValidations = body("course")
    .trim()
    .notEmpty()
    .withMessage("Course ID is required.")
    .isMongoId()
    .withMessage("Invalid course ID.");

const createOrderValidator = [courseValidations];

///////////////////////////////////////////////////////////////
// exports

export { createOrderValidator };
