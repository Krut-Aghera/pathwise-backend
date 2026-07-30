import express from "express";
import validationEngine from "../../middlewares/validation.middleware.js";
import * as authMiddlewares from "../../middlewares/auth/auth.middleware.js";
import * as authControllers from "./auth.controller.js";
import * as authValidations from "./auth.validators.js";
import {
    changePasswordRateLimiter,
    forgotPasswordRateLimiter,
    loginRateLimiter,
    registerRateLimiter,
    requestEmailVerificationRateLimiter,
} from "../../middlewares/ratelimiter/limiters/auth.ratelimit.js";
import { validateCryptoTokenParam } from "../../validations/common.validators.js";

///////////////////////////////////////////////////////////////
// create router

const authRouter = express.Router();

//
//  ------------------------------------------------
//   PUBLIC ROUTES
//  ------------------------------------------------
//

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/register
// Registers a new user account.

authRouter.post(
    "/register",
    registerRateLimiter,
    authValidations.registerUser,
    validationEngine,
    authControllers.registerUser
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/login
// Authenticates a user and issues access and refresh tokens.

authRouter.post(
    "/login",
    loginRateLimiter,
    authValidations.login,
    validationEngine,
    authControllers.login
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/rotate-tokens
// Rotates the authenticated user's access and refresh tokens.

authRouter.post(
    "/rotate-tokens",
    authMiddlewares.requireActiveAccount,
    authControllers.rotateTokens
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/forgot-password
// Initiates a password reset request.

authRouter.post(
    "/password/forgot",
    forgotPasswordRateLimiter,
    authValidations.requestPasswordReset,
    validationEngine,
    authControllers.requestPasswordReset
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/reset-password/:token
// Resets the user's password using a valid password reset token.

authRouter.post(
    "/password/reset/:token",
    validateCryptoTokenParam({
        paramName: "token",
        fieldName: "Password reset token",
    }),
    authValidations.resetPassword,
    validationEngine,
    authControllers.resetPassword
);

//
//  ------------------------------------------------
//   PRIVATE ROUTES [AUTHENTICATED USER]
//  ------------------------------------------------
//

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/logout
// Logs out the authenticated user and invalidates their session.

authRouter.post(
    "/logout",
    authMiddlewares.tokenVerificationEngine,
    authControllers.logout
);

///////////////////////////////////////////////////////////////
// POST /api/v1/auth/request-email-verification
// Sends a new email verification link to the authenticated user's email address.

authRouter.post(
    "/request/email-verification",
    requestEmailVerificationRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authControllers.requestEmailVerification
);

///////////////////////////////////////////////////////////////
// GET /api/v1/auth/confirm-email-verification/:token
// Verifies the user's email address using the verification token.

authRouter.get(
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

authRouter.post(
    "/change-password",
    changePasswordRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authValidations.changePassword,
    validationEngine,
    authControllers.changePassword
);

///////////////////////////////////////////////////////////////
// exports

export default authRouter;
