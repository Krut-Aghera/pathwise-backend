import express from "express";
import * as authMiddlewares from "../../middlewares/auth.middleware.js";
import * as userControllers from "./user.controllers.js";
import * as userValidations from "./user.validators.js";
import validationEngine from "../../middlewares/validation.middleware.js";
import {
    requestAccountDeletionRateLimiter,
    requestEmailChangeRateLimiter,
    requestInstructorAccessRateLimiter,
    updateProfileRateLimiter,
} from "../../middlewares/ratelimiter/limiters/user.ratelimit.js";
import {
    validateCryptoTokenParam,
    validateMongoIdParam,
} from "../../validations/common.validators.js";

///////////////////////////////////////////////////////////////
// create router

const userRouter = express.Router();

//
//  ------------------------------------------------
//   PUBLIC ROUTES
//  ------------------------------------------------
//

///////////////////////////////////////////////////////////////
// GET /api/v1/users/instructor/:userId
// Retrieves the public profile of a specific instructor.

userRouter.get(
    "/instructor/:userId",
    validateMongoIdParam({
        paramName: "userId",
        fieldName: "Instructor ID",
    }),
    validationEngine,
    userControllers.fetchInstructorProfile
);

//
//  ------------------------------------------------
//   PRIVATE ROUTES [AUTHENTICATED USER]
//  ------------------------------------------------
//

///////////////////////////////////////////////////////////////
// GET /api/v1/users/me
// Retrieves the authenticated user's profile.

userRouter.get(
    "/me",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userControllers.currentUser
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/users/me/username
// Updates the authenticated user's username.

userRouter.patch(
    "/me/username",
    updateProfileRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.usernameUpdation,
    validationEngine,
    userControllers.updateUsername
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/email/request
// Initiates an email address change request.

userRouter.post(
    "/me/email/request",
    requestEmailChangeRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userValidations.emailUpdation,
    validationEngine,
    userControllers.requestEmailUpdation
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/email/confirm/:token
// Confirms and completes the email address change.

userRouter.post(
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

userRouter.post(
    "/me/instructor/request",
    requestInstructorAccessRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userControllers.requestInstructorAccess
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/instructor/confirm/:token
// Confirms and grants instructor access.

userRouter.post(
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

userRouter.post(
    "/me/deactivation/request",
    requestAccountDeletionRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.deactivateAccountRequest,
    validationEngine,
    userControllers.requestAccountDeactivation
);

///////////////////////////////////////////////////////////////
// POST /api/v1/users/me/deactivation/confirm
// Confirms and permanently deactivates the authenticated user's account.

userRouter.post(
    "/me/deactivation/confirm",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.confirmAccountDeactivation,
    validationEngine,
    userControllers.confirmAccountDeactivation
);

///////////////////////////////////////////////////////////////
// export

export default userRouter;
