import { body } from "express-validator";
import * as authValidations from "../auth/auth.validators.js";
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

///////////////////////////////////////////////////////////////
// username updation validators

const usernameUpdationValidators = [usernameValidations];

///////////////////////////////////////////////////////////////
// email updation validators

const emailUpdationValidators = [passwordValidations, newEmailValidations];

///////////////////////////////////////////////////////////////
// acount deactivation request validators

const accountDeactivationRequestValidators = [passwordValidations];

///////////////////////////////////////////////////////////////
// account deactivation confirmation validators

const accountDeactivationConfirmationValidators = [otpValidations];

///////////////////////////////////////////////////////////////
// export

export {
    emailUpdationValidators,
    usernameUpdationValidators,
    accountDeactivationRequestValidators,
    accountDeactivationConfirmationValidators,
};
