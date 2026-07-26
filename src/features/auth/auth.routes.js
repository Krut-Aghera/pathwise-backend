import express from "express";
import validationEngine from "../../middlewares/validation.middleware.js";
import * as authMiddlewares from "../../middlewares/auth.middleware.js";
import * as authControllers from "./auth.controller.js";
import * as authValidations from "./auth.validators.js";
import {
    changePasswordRateLimiter,
    forgotPasswordRateLimiter,
    loginRateLimiter,
    registerRateLimiter,
    resetPasswordRateLimiter,
} from "../../middlewares/ratelimiter/limiters/auth.ratelimit.js";

///////////////////////////////////////////////////////////////
// create router

const authRouter = express.Router();

///////////////////////////////////////////////////////////////
// registration route

authRouter.post(
    "/register",
    registerRateLimiter,
    authValidations.registerUser,
    validationEngine,
    authControllers.registerUser
);

///////////////////////////////////////////////////////////////
// login route

authRouter.post(
    "/login",
    loginRateLimiter,
    authValidations.login,
    validationEngine,
    authControllers.login
);

///////////////////////////////////////////////////////////////
// logout route

authRouter.post(
    "/logout",
    authMiddlewares.tokenVerificationEngine,
    authControllers.logout
);

///////////////////////////////////////////////////////////////
// token rotation route

authRouter.post(
    "/rotate-tokens",
    authMiddlewares.requireActiveAccount,
    authControllers.rotateTokens
);

///////////////////////////////////////////////////////////////
// forgot password route

authRouter.post(
    "/forgot-password",
    forgotPasswordRateLimiter,
    authValidations.forgotPassword,
    validationEngine,
    authControllers.forgotPassword
);

///////////////////////////////////////////////////////////////
// reset password route

authRouter.post(
    "/reset-password/:token",
    resetPasswordRateLimiter,
    authValidations.resetPassword,
    validationEngine,
    authControllers.resetPassword
);

///////////////////////////////////////////////////////////////
// change password route

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
