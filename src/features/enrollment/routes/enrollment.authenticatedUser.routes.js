import express from "express";
import * as enrollmentControllers from "../enrollment.controllers.js";
import * as enrollmentRatelimiter from "../../../middlewares/ratelimiter/limiters/enrollment.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import { userAuthEngine } from "../../../middlewares/auth/auth.middleware.engines.js";

///////////////////////////////////////////////////////////////
// create router

const enrollmentAuthenticatedUserRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments
// Fetches all enrollments for the authenticated student.

enrollmentAuthenticatedUserRouter.get(
    "/",
    enrollmentRatelimiter.fetchStudentEnrollmentsRateLimiter,
    ...userAuthEngine,
    validationEngine,
    enrollmentControllers.fetchStudentEnrollments
);

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments/courses/:courseId
// Fetches the authenticated student's enrollment for the specified course.

enrollmentAuthenticatedUserRouter.get(
    "/courses/:courseId",
    enrollmentRatelimiter.fetchStudentEnrollmentByCourseRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    enrollmentControllers.fetchStudentEnrollmentByCourse
);

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments/:enrollmentId
// Fetches the specified enrollment for the authenticated student.

enrollmentAuthenticatedUserRouter.get(
    "/:enrollmentId",
    enrollmentRatelimiter.fetchStudentCurrentEnrollmentRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "enrollmentId",
        fieldName: "Enrollment ID",
    }),
    validationEngine,
    enrollmentControllers.fetchStudentCurrentEnrollment
);

///////////////////////////////////////////////////////////////
// export

export default enrollmentAuthenticatedUserRouter;
