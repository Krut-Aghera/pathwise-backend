import { body } from "express-validator";
import * as authValidations from "../auth/auth.validators.js";
import REGEX_VALIDATIONS from "../../constants/regex.constants.js";

const passwordValidations = body("password")
    .notEmpty()
    .withMessage("Current password is required.");

const newEmailValidations = body("newEmail")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .matches(REGEX_VALIDATIONS.email.PATTERN)
    .withMessage(REGEX_VALIDATIONS.email.MESSAGE);

const otpValidations = body("otp")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required.")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits.")
    .bail()
    .isNumeric()
    .withMessage("Verification code must contain only numbers.");

const confirmAccountDeactivation = [otpValidations];

const usernameUpdation = [authValidations.usernameValidator];

const emailUpdation = [passwordValidations, newEmailValidations];

const deactivateAccountRequest = [passwordValidations];

export {
    deactivateAccountRequest,
    confirmAccountDeactivation,
    usernameUpdation,
    emailUpdation,
};
