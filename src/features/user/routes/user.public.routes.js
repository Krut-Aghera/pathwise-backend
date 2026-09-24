import express from "express";
import * as userControllers from "../user.controllers.js";
import * as userValidations from "../user.validators.js"
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import accessTokenVerification from "../../../middlewares/auth/tokens/access-token.verification.js";
import requireActiveAccount from "../../../middlewares/auth/states/active-account.require.js";
import requireVerifiedEmail from "../../../middlewares/auth/states/verify-email.require.js";
import validateCryptoTokenParam from "../../../validations/crypto-tokenParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const userPublicRouter = express.Router();

// GET /api/v1/users/instructors/:instructorId
// Retrieves the public profile of a specific instructor.

userPublicRouter.get(
    "/instructors-profile/:instructorId",
    validateMongoIdParam({
        paramName: "instructorId",
        fieldName: "Instructor ID",
    }),
    validationEngine,
    userControllers.fetchInstructorProfile
);

// POST /api/v1/users/me/deactivation/confirm
// Confirms and deactivates the authenticated user's account.

userPublicRouter.post(
    "/me/deactivation/confirm",
    accessTokenVerification,
    requireActiveAccount,
    userValidations.accountDeactivationConfirmationValidators,
    validationEngine,
    userControllers.confirmAccountDeactivation
);

// POST /api/v1/users/me/instructor-access/confirm/:token
// Confirms and grants instructor access.

userPublicRouter.post(
    "/me/instructor-access/confirm/:token",
    accessTokenVerification,
    requireActiveAccount,
    requireVerifiedEmail,
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Instructor access token",
    }),
    validationEngine,
    userControllers.confirmInstructorAccess
);

// POST /api/v1/users/me/email-change/confirm/:token
// Confirms and completes the email address change.

userPublicRouter.post(
    "/me/email-change/confirm/:token",
    accessTokenVerification,
    requireActiveAccount,
    requireVerifiedEmail,
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Email change token",
    }),
    validationEngine,
    userControllers.confirmEmailUpdation
);

///////////////////////////////////////////////////////////////
// export

export default userPublicRouter;
