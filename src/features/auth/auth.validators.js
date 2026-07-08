import { body } from "express-validator";
import REGEX_VALIDATIONS from "../../constants/regex-validation.js";

///////////////////////////////////////////////////////////////
// registration validation

const registerUser = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(REGEX_VALIDATIONS.username.PATTERN)
        .withMessage(REGEX_VALIDATIONS.username.MESSAGE),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .matches(REGEX_VALIDATIONS.email.PATTERN)
        .withMessage(REGEX_VALIDATIONS.email.MESSAGE),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .matches(REGEX_VALIDATIONS.password.PATTERN)
        .withMessage(REGEX_VALIDATIONS.password.MESSAGE),
];

///////////////////////////////////////////////////////////////
// login validation

const login = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .matches(REGEX_VALIDATIONS.email.PATTERN)
        .withMessage("Invalid credentials."),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .matches(REGEX_VALIDATIONS.password.PATTERN)
        .withMessage("Invalid credentials."),
];

export { registerUser, login };
