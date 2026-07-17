import express from "express";
import * as authMiddlewares from "../../middlewares/auth.middleware.js";
import * as userControllers from "./user.controllers.js";
import * as userValidations from "./user.validators.js";
import validationEngine from "../../middlewares/validation.middleware.js";
import {
    passwordRateLimiter,
    updateProfileRateLimiter,
} from "../../middlewares/ratelimiter/ratelimit.middleware.js";

const userRouter = express.Router();

///////////////////////////////////////////////////////////////
// get current user route

userRouter.get(
    "/me",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userControllers.getCurrentUser
);

///////////////////////////////////////////////////////////////
// update user name route

userRouter.patch(
    "/me/username",
    updateProfileRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.usernameUpdation,
    validationEngine,
    userControllers.usernameUpdation
);

///////////////////////////////////////////////////////////////
// change email request route

userRouter.post(
    "/me/email/request",
    updateProfileRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userValidations.emailUpdation,
    validationEngine,
    userControllers.requestEmailUpdation
);

///////////////////////////////////////////////////////////////
// change email confirmation route

userRouter.post(
    "/me/email/confirm/:token",
    updateProfileRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userControllers.confirmEmailUpdation
);

///////////////////////////////////////////////////////////////
// Request instructor access

userRouter.post(
    "/me/instructor/request",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userControllers.requestInstructorAccess
);

///////////////////////////////////////////////////////////////
// Confirm instructor access

userRouter.post(
    "/me/instructor/confirm/:token",
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    userControllers.confirmInstructorAccess
);

///////////////////////////////////////////////////////////////
// get instructor profile route

userRouter.get("/instructor/:id", userControllers.getInstructorProfile);

///////////////////////////////////////////////////////////////
// deactivate account request route

userRouter.post(
    "/me/deactivation/request",
    passwordRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.deactivateAccountRequest,
    validationEngine,
    userControllers.requestAccountDeactivation
);

///////////////////////////////////////////////////////////////
// deactivate account confirmation route

userRouter.post(
    "/me/deactivation/confirm",
    passwordRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    userValidations.confirmAccountDeactivation,
    validationEngine,
    userControllers.confirmAccountDeactivation
);

///////////////////////////////////////////////////////////////
// export

export default userRouter;
