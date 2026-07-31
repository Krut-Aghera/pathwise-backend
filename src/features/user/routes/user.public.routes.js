import express from "express";
import * as userControllers from "../user.controllers.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import { validateMongoIdParam } from "../../../validations/common.validators.js";

///////////////////////////////////////////////////////////////
// create router

const userPublicRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/users/instructor/:userId
// Retrieves the public profile of a specific instructor.

userPublicRouter.get(
    "/instructor/:userId",
    validateMongoIdParam({
        paramName: "userId",
        fieldName: "Instructor ID",
    }),
    validationEngine,
    userControllers.fetchInstructorProfile
);

///////////////////////////////////////////////////////////////
// export

export default userPublicRouter;
