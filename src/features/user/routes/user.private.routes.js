import express from "express";

import * as authMiddlewares from "../../../middlewares/auth/auth.middleware.js";
import * as userControllers from "../user.controllers.js";
import * as userValidations from "../user.validators.js";
import * as userRatelimiter from "../../../middlewares/ratelimiter/limiters/user.ratelimit.js";

import validationEngine from "../../../middlewares/validation.middleware.js";
import validateCryptoTokenParam from "../../../validations/crypto-tokenParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const userPrivateRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/users/me
// Retrieves the authenticated user's profile.

userPrivateRouter.get(
    "/me",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userControllers.currentUser
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/users/me/username
// Updates the authenticated user's username.

userPrivateRouter.patch(
    "/me/username",
    userRatelimiter.updateProfileRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.usernameUpdationValidators,
    validationEngine,
    userControllers.updateUsername
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/email/request
// Initiates an email address change request.

userPrivateRouter.post(
    "/me/email/request",
    userRatelimiter.requestEmailChangeRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userValidations.emailUpdationValidators,
    validationEngine,
    userControllers.requestEmailUpdation
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/email/confirm/:token
// Confirms and completes the email address change.

userPrivateRouter.post(
    "/me/email/confirm/:token",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Email updation token",
    }),
    validationEngine,
    userControllers.confirmEmailUpdation
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/instructor/request
// Initiates an instructor access request.

userPrivateRouter.post(
    "/me/instructor/request",
    userRatelimiter.requestInstructorAccessRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userControllers.requestInstructorAccess
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/instructor/confirm/:token
// Confirms and grants instructor access.

userPrivateRouter.post(
    "/me/instructor/confirm/:token",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Instructor access token",
    }),
    validationEngine,
    userControllers.confirmInstructorAccess
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/deactivation/request
// Initiates an account deactivation request.

userPrivateRouter.post(
    "/me/deactivation/request",
    userRatelimiter.requestAccountDeletionRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.accountDeactivationRequestValidators,
    validationEngine,
    userControllers.requestAccountDeactivation
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/deactivation/confirm
// Confirms and permanently deactivates the authenticated user's account.

userPrivateRouter.post(
    "/me/deactivation/confirm",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.accountDeactivationConfirmationValidators,
    validationEngine,
    userControllers.confirmAccountDeactivation
);

///////////////////////////////////////////////////////////////
// export

export default userPrivateRouter;
