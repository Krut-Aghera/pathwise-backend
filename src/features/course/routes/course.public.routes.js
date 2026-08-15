import express from "express";
import * as courseControllers from "../course.controllers.js";
import * as courseValidations from "../course.validators.js";
import * as courseRatelimiter from "../../../middlewares/ratelimiter/limiters/course.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const coursePublicRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/courses
// Retrieves publicly available courses with pagination,
// searching, filtering, and sorting support.

coursePublicRouter.get(
    "/",
    courseRatelimiter.fetchCourseRateLimiter,
    courseValidations.fetchCoursesValidators,
    validationEngine,
    courseControllers.fetchCourses
);

///////////////////////////////////////////////////////////////
// GET /api/v1/courses/:courseId
// Retrieves the public details of a specific course.

coursePublicRouter.get(
    "/:courseId",
    courseRatelimiter.fetchCurrentCourseRateLimiter,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.fetchCurrentCourse
);

///////////////////////////////////////////////////////////////
// export

export default coursePublicRouter;
