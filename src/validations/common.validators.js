import { param } from "express-validator";

export const validateMongoIdParam = ({
    paramName = "id",
    fieldName = "ID",
} = {}) =>
    param(paramName)
        .notEmpty()
        .withMessage(`${fieldName} is required.`)
        .bail()
        .isMongoId()
        .withMessage(`Invalid ${fieldName}.`);
