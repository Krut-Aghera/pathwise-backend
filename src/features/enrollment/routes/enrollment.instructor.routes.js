import express from "express";
import * as enrollmentControllers from "../enrollment.controllers.js";
import * as enrollmentRatelimiter from "../../../middlewares/ratelimiter/limiters/enrollment.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import { instructorAuthEngine } from "../../../middlewares/auth/auth.middleware.engines.js";

///////////////////////////////////////////////////////////////
// create router

const enrollmentInstructorRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments/instructors/courses/:courseId
// Fetches all enrollments for the specified course.

enrollmentInstructorRouter.get(
    "/courses/:courseId",
    enrollmentRatelimiter.fetchCourseEnrollmentsRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    enrollmentControllers.fetchCourseEnrollments
);

///////////////////////////////////////////////////////////////
// export

export default enrollmentInstructorRouter;
