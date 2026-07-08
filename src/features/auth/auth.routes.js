import express from "express";
import validationEngine from "../../middlewares/validation.middleware.js";
import * as authMiddlewares from "../../middlewares/auth.middleware.js";
import * as authControllers from "./auth.controller.js";
import * as authValidations from "./auth.validators.js";

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
// exports

export default authRouter;
