import express from "express";

import * as authControllers from "../auth.controller.js";
import * as authValidations from "../auth.validators.js";

import requireActiveAccount from "../../../middlewares/auth/states/active-account.require.js";
import refreshTokenVerification from "../../../middlewares/auth/tokens/refresh-token.verification.js";
import * as authRateLimiter from "../../../middlewares/ratelimiter/limiters/auth.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";

import validateCryptoTokenParam from "../../../validations/crypto-tokenParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const authPublicRouter = express.Router();

/// POST /api/v1/auth/users
// Registers a new user account.

authPublicRouter.post(
    "/users",
    authRateLimiter.registerRateLimiter,
    authValidations.registerUserValidators,
    validationEngine,
    authControllers.registerUser
);

// POST /api/v1/auth/sessions
// Authenticates a user and creates an authenticated session.

authPublicRouter.post(
    "/sessions",
    authRateLimiter.loginRateLimiter,
    authValidations.loginValidators,
    validationEngine,
    authControllers.login
);

// POST /api/v1/auth/email-verification/confirm/:token
// Verifies the user's email address using the verification token.

authPublicRouter.post(
    "/email-verification/confirm/:token",
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Email verification token",
    }),
    validationEngine,
    authControllers.confirmEmailVerification
);

// POST /api/v1/auth/tokens/rotate
// Rotates the user's access and refresh tokens.

authPublicRouter.post(
    "/tokens/rotate",
    refreshTokenVerification,
    requireActiveAccount,
    authControllers.rotateTokens
);

// POST /api/v1/auth/password-reset
// Initiates a password reset request.

authPublicRouter.post(
    "/password-reset",
    authRateLimiter.forgotPasswordRateLimiter,
    authValidations.requestPasswordResetValidators,
    validationEngine,
    authControllers.requestPasswordReset
);

// POST /api/v1/auth/password-reset/confirm
// Resets the user's password using a valid password reset token.

authPublicRouter.post(
    "/password-reset/confirm/:token",
    authValidations.resetPasswordValidators,
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Password reset token",
    }),
    validationEngine,
    authControllers.resetPassword
);

///////////////////////////////////////////////////////////////
// exports

export default authPublicRouter;
