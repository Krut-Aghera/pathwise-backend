import express from "express";

import * as authControllers from "../auth.controller.js";
import * as authValidations from "../auth.validators.js";
import * as authMiddlewares from "../../../middlewares/auth/auth.middleware.js";
import * as authRatelimiter from "../../../middlewares/ratelimiter/limiters/auth.ratelimit.js";

import validationEngine from "../../../middlewares/validation.middleware.js";

import { validateCryptoTokenParam } from "../../../validations/common.validators.js";

///////////////////////////////////////////////////////////////
// create router

const authPrivateRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/logout
// Logs out the authenticated user and invalidates their session.

authPrivateRouter.post(
    "/logout",
    authMiddlewares.tokenVerificationEngine,
    authControllers.logout
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/email/request
// Sends a new email verification link to the authenticated user's email address.

authPrivateRouter.post(
    "/email/request",
    authRatelimiter.requestEmailVerificationRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authControllers.requestEmailVerification
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/password/change
// Changes the authenticated user's password.

authPrivateRouter.post(
    "/password/change",
    authRatelimiter.changePasswordRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authValidations.changePasswordValidators,
    validationEngine,
    authControllers.changePassword
);

///////////////////////////////////////////////////////////////
// exports

export default authPrivateRouter;
