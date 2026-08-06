import { body } from "express-validator";

import REGEX_VALIDATIONS from "../../constants/regex.constants.js";

//
//
///////////////////////////////////////////////////////////////
// reusable validators
//
//

const usernameValidations = body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .bail()
    .matches(REGEX_VALIDATIONS.username.PATTERN)
    .withMessage(REGEX_VALIDATIONS.username.MESSAGE);

const emailValidations = body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .matches(REGEX_VALIDATIONS.email.PATTERN)
    .withMessage(REGEX_VALIDATIONS.email.MESSAGE);

const passwordValidations = body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .matches(REGEX_VALIDATIONS.password.PATTERN)
    .withMessage(REGEX_VALIDATIONS.password.MESSAGE);

const currentPasswordValidations = body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .bail()
    .matches(REGEX_VALIDATIONS.password.PATTERN)
    .withMessage("Current password is incorrect");

const newPasswordValidations = body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .bail()
    .matches(REGEX_VALIDATIONS.password.PATTERN)
    .withMessage(REGEX_VALIDATIONS.password.MESSAGE);

const confirmPasswordValidations = body("confirmPassword")
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
// signup validators

const registerUserValidators = [
    usernameValidations,
    emailValidations,
    passwordValidations,
];

///////////////////////////////////////////////////////////////
// login validators

const loginValidators = [
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
//  request reset password validators

const requestPasswordResetValidators = [emailValidations];

///////////////////////////////////////////////////////////////
// reset password validators

const resetPasswordValidators = [
    newPasswordValidations,
    confirmPasswordValidations,
];

///////////////////////////////////////////////////////////////
// change password validators

const changePasswordValidators = [
    currentPasswordValidations,
    newPasswordValidations,
];

///////////////////////////////////////////////////////////////
// exports

export {
    registerUserValidators,
    loginValidators,
    requestPasswordResetValidators,
    resetPasswordValidators,
    changePasswordValidators,
};
