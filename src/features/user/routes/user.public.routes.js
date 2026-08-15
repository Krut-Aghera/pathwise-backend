import express from "express";
import * as userControllers from "../user.controllers.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const userPublicRouter = express.Router();

// GET /api/v1/users/instructors/:instructorId
// Retrieves the public profile of a specific instructor.

userPublicRouter.get(
    "/instructors-profile/:instructorId",
    validateMongoIdParam({
        paramName: "instructorId",
        fieldName: "Instructor ID",
    }),
    validationEngine,
    userControllers.fetchInstructorProfile
);

///////////////////////////////////////////////////////////////
// export

export default userPublicRouter;
