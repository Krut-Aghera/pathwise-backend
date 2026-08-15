import express from "express";

import requireActiveAccount from "../../../middlewares/auth/states/active-account.require.js";
import requireVerifiedEmail from "../../../middlewares/auth/states/verify-email.require.js";
import * as userControllers from "../user.controllers.js";
import * as userValidations from "../user.validators.js";
import * as userRatelimiter from "../../../middlewares/ratelimiter/limiters/user.ratelimit.js";
import accessTokenVerification from "../../../middlewares/auth/tokens/access-token.verification.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateCryptoTokenParam from "../../../validations/crypto-tokenParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const userPrivateRouter = express.Router();

// GET /api/v1/users/me
// Retrieves the authenticated user's profile.

userPrivateRouter.get(
    "/me",
    accessTokenVerification,
    requireActiveAccount,
    userControllers.currentUser
);

// PATCH /api/v1/users/me/username
// Updates the authenticated user's username.

userPrivateRouter.patch(
    "/me/username",
    userRatelimiter.updateProfileRateLimiter,
    accessTokenVerification,
    requireActiveAccount,
    userValidations.usernameUpdateValidators,
    validationEngine,
    userControllers.updateUsername
);

// POST /api/v1/users/me/email-change
// Initiates an email address change request.

userPrivateRouter.post(
    "/me/email-change",
    userRatelimiter.requestEmailChangeRateLimiter,
    accessTokenVerification,
    requireActiveAccount,
    requireVerifiedEmail,
    userValidations.emailUpdateValidators,
    validationEngine,
    userControllers.requestEmailUpdation
);

// POST /api/v1/users/me/email-change/confirm/:token
// Confirms and completes the email address change.

userPrivateRouter.post(
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

// POST /api/v1/users/me/instructor-access
// Initiates an instructor access request.

userPrivateRouter.post(
    "/me/instructor-access",
    userRatelimiter.requestInstructorAccessRateLimiter,
    accessTokenVerification,
    requireActiveAccount,
    requireVerifiedEmail,
    userControllers.requestInstructorAccess
);

// POST /api/v1/users/me/instructor-access/confirm/:token
// Confirms and grants instructor access.

userPrivateRouter.post(
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

// POST /api/v1/users/me/deactivation
// Initiates an account deactivation request.

userPrivateRouter.post(
    "/me/deactivation",
    userRatelimiter.requestAccountDeletionRateLimiter,
    accessTokenVerification,
    requireActiveAccount,
    userValidations.accountDeactivationRequestValidators,
    validationEngine,
    userControllers.requestAccountDeactivation
);

// POST /api/v1/users/me/deactivation/confirm
// Confirms and deactivates the authenticated user's account.

userPrivateRouter.post(
    "/me/deactivation/confirm",
    accessTokenVerification,
    requireActiveAccount,
    userValidations.accountDeactivationConfirmationValidators,
    validationEngine,
    userControllers.confirmAccountDeactivation
);

///////////////////////////////////////////////////////////////
// export

export default userPrivateRouter;
