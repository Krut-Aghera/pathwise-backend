import { param } from "express-validator";

export const validateMongoIdParam = ({
    paramName = "id",
    fieldName = "ID",
} = {}) => [
    // param(paramName)
    //     .notEmpty()
    //     .withMessage(`${fieldName} is required.`)
    //     .bail()
    //     .isMongoId()
    //     .withMessage(`Invalid ${fieldName}.`),
];

export const validateCryptoTokenParam = ({
    paramName = "token",
    fieldName = "Token",
} = {}) => [
    param(paramName)
        .exists({ checkFalsy: true })
        .withMessage(`${fieldName} is required.`)
        .bail()
        .isHexadecimal()
        .withMessage(`${fieldName} is invalid.`)
        .bail()
        .isLength({ min: 64, max: 64 })
        .withMessage(`${fieldName} is invalid.`),
];
