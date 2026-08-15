import express from "express";

import * as authControllers from "../auth.controller.js";
import * as authValidations from "../auth.validators.js";

import accessTokenVerification from "../../../middlewares/auth/tokens/access-token.verification.js";
import requireActiveAccount from "../../../middlewares/auth/states/active-account.require.js";
import * as authRateLimiter from "../../../middlewares/ratelimiter/limiters/auth.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";

import validateCryptoTokenParam from "../../../validations/crypto-tokenParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const authPrivateRouter = express.Router();

// POST /api/v1/auth/sessions/current
// Logs out the authenticated user and invalidates their current session.

authPrivateRouter.post(
    "/sessions/current",
    accessTokenVerification,
    authControllers.logout
);

// POST /api/v1/auth/email-verification
// Sends a new email verification link to the authenticated user's email address.

authPrivateRouter.post(
    "/email-verification",
    authRateLimiter.requestEmailVerificationRateLimiter,
    accessTokenVerification,
    requireActiveAccount,
    authControllers.requestEmailVerification
);

// PATCH /api/v1/auth/password
// Changes the authenticated user's password.

authPrivateRouter.patch(
    "/password",
    authRateLimiter.changePasswordRateLimiter,
    accessTokenVerification,
    requireActiveAccount,
    authValidations.changePasswordValidators,
    validationEngine,
    authControllers.changePassword
);

///////////////////////////////////////////////////////////////
// exports

export default authPrivateRouter;
