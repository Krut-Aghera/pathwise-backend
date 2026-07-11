import express from "express";
import validationEngine from "../../middlewares/validation.middleware.js";
import * as authMiddlewares from "../../middlewares/auth.middleware.js";
import * as authControllers from "./auth.controller.js";
import * as authValidations from "./auth.validators.js";
import { passwordRateLimiter } from "../../middlewares/ratelimit.middleware.js";

const authRouter = express.Router();

///////////////////////////////////////////////////////////////
// registration route

authRouter.post(
    "/register",
    authValidations.registerUser, // express validatior array => username || email || password
    validationEngine, // validation middleware => catches express validatior errors if exists
    authControllers.registerUser
);

///////////////////////////////////////////////////////////////
// login route

authRouter.post(
    "/login",
    authValidations.login, // express validatior array => email || password
    validationEngine,
    authControllers.login
);

///////////////////////////////////////////////////////////////
// logout route

authRouter.post(
    "/logout",
    authMiddlewares.tokenVerificationEngine, // access token (login session) verificatioon
    authControllers.logout
);

///////////////////////////////////////////////////////////////
// token rotation route

authRouter.post(
    "/rotate-tokens",
    authMiddlewares.requireActiveAccount,
    authControllers.rotateTokens // re-generate jwt access and refreshtoken
);

///////////////////////////////////////////////////////////////
// forgot password route

authRouter.post(
    "/forgot-password",
    passwordRateLimiter,
    authValidations.forgotPassword,
    validationEngine,
    authControllers.forgotPassword
);

///////////////////////////////////////////////////////////////
// reset password route

authRouter.post(
    "/reset-password/:token",
    authValidations.resetPassword,
    validationEngine,
    authControllers.resetPassword
);

///////////////////////////////////////////////////////////////
// change password route

authRouter.post(
    "/change-password",
    passwordRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.requireActiveAccount,
    authValidations.changePassword,
    validationEngine,
    authControllers.changePassword
);

///////////////////////////////////////////////////////////////
// exports

export default authRouter;
