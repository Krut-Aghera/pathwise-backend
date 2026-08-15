import { param } from "express-validator";

const validateCryptoTokenParam = ({
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

export default validateCryptoTokenParam;
