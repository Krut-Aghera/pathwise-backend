import express from "express";
import validationEngine from "../../middlewares/validation.middleware.js";
import { registerUserValidation } from "./auth.validators.js";
import { registerUser } from "./auth.controller.js";

const authRouter = express.Router();

///////////////////////////////////////////////////////////////
// registration route

authRouter.post(
    "/register",
    registerUserValidation, // express validatior array => username || email || password
    validationEngine, // validation middleware => catches express validatior errors if exists
    registerUser // controller for user registratioon
);

///////////////////////////////////////////////////////////////
// exports

export default authRouter;
