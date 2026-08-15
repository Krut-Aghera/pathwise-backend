import { param } from "express-validator";

const validateMongoIdParam = ({ paramName = "id", fieldName = "ID" } = {}) => [
    param(paramName)
        .notEmpty()
        .withMessage(`${fieldName} is required.`)
        .bail()
        .isMongoId()
        .withMessage(`Invalid ${fieldName}.`),
];

export default validateMongoIdParam;
