import express from "express";
import * as authControllers from "../auth.controller.js";
import * as authValidations from "../auth.validators.js";
import * as authMiddlewares from "../../../middlewares/auth/auth.middleware.js";
import * as authRatelimiter from "../../../middlewares/ratelimiter/limiters/auth.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import { validateCryptoTokenParam } from "../../../validations/common.validators";

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
// POST /api/v1/auth/request-email-verification
// Sends a new email verification link to the authenticated user's email address.

authPrivateRouter.post(
    "/request/email-verification",
    authRatelimiter.requestEmailVerificationRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authControllers.requestEmailVerification
);

///////////////////////////////////////////////////////////////
// GET /api/v1/auth/confirm-email-verification/:token
// Verifies the user's email address using the verification token.

authPrivateRouter.get(
    "/confirm/email-verification/:token",
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Email verification token",
    }),
    validationEngine,
    authControllers.confirmEmailVerification
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/change-password
// Changes the authenticated user's password.

authPrivateRouter.post(
    "/change-password",
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
