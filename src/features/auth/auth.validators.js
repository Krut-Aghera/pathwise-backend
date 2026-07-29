import { body } from "express-validator";
import REGEX_VALIDATIONS from "../../constants/regex.constants.js";

///////////////////////////////////////////////////////////////
// Reusable Field Validators

const usernameValidator = body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .bail()
    .matches(REGEX_VALIDATIONS.username.PATTERN)
    .withMessage(REGEX_VALIDATIONS.username.MESSAGE);

const emailValidator = body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .matches(REGEX_VALIDATIONS.email.PATTERN)
    .withMessage(REGEX_VALIDATIONS.email.MESSAGE);

const passwordValidator = body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .matches(REGEX_VALIDATIONS.password.PATTERN)
    .withMessage(REGEX_VALIDATIONS.password.MESSAGE);

const currentPasswordValidator = body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .bail()
    .matches(REGEX_VALIDATIONS.password.PATTERN)
    .withMessage(REGEX_VALIDATIONS.password.MESSAGE);

const newPasswordValidator = body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .bail()
    .matches(REGEX_VALIDATIONS.password.PATTERN)
    .withMessage(REGEX_VALIDATIONS.password.MESSAGE);

const confirmPasswordValidator = body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .bail()
    .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error("Passwords do not match.");
        }

        return true;
    });

///////////////////////////////////////////////////////////////
// Registration Validation

const registerUser = [usernameValidator, emailValidator, passwordValidator];

///////////////////////////////////////////////////////////////
// Login Validation

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

///////////////////////////////////////////////////////////////
// Forgot Password Validation

const requestPasswordReset = [emailValidator];

///////////////////////////////////////////////////////////////
// Reset Password Validation

const resetPassword = [newPasswordValidator, confirmPasswordValidator];

///////////////////////////////////////////////////////////////
// change Password Validation

const changePassword = [currentPasswordValidator, newPasswordValidator];

export {
    usernameValidator,
    emailValidator,
    registerUser,
    login,
    requestPasswordReset,
    resetPassword,
    changePassword,
};
