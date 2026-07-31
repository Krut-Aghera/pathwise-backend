import express from "express";
import * as authControllers from "../auth.controller.js";
import * as authValidations from "../auth.validators.js";
import * as authMiddlewares from "../../../middlewares/auth/auth.middleware.js";
import * as authRatelimiter from "../../../middlewares/ratelimiter/limiters/auth.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import { validateCryptoTokenParam } from "../../../validations/common.validators";

///////////////////////////////////////////////////////////////
// create router

const authPublicRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/register
// Registers a new user account.

authPublicRouter.post(
    "/register",
    authRatelimiter.registerRateLimiter,
    authValidations.registerUserValidators,
    validationEngine,
    authControllers.registerUser
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/login
// Authenticates a user and issues access and refresh tokens.

authPublicRouter.post(
    "/login",
    authRatelimiter.loginRateLimiter,
    authValidations.loginValidators,
    validationEngine,
    authControllers.login
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/rotate-tokens
// Rotates the authenticated user's access and refresh tokens.

authPublicRouter.post(
    "/rotate-tokens",
    authMiddlewares.requireActiveAccount,
    authControllers.rotateTokens
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/forgot-password
// Initiates a password reset request.

authPublicRouter.post(
    "/password/forgot",
    authRatelimiter.forgotPasswordRateLimiter,
    authValidations.requestPasswordResetValidators,
    validationEngine,
    authControllers.requestPasswordReset
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/reset-password/:token
// Resets the user's password using a valid password reset token.

authPublicRouter.post(
    "/password/reset/:token",
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Password reset token",
    }),
    authValidations.resetPasswordValidators,
    validationEngine,
    authControllers.resetPassword
);

///////////////////////////////////////////////////////////////
// exports

export default authPublicRouter;
