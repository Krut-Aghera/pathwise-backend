import express from "express";
import * as enrollmentControllers from "../enrollment.controllers.js";
import * as enrollmentRatelimiter from "../../../middlewares/ratelimiter/limiters/enrollment.ratelimit.js";
import studentAuthEngine from "../../../middlewares/auth/engines/student-auth.engine.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const enrollmentStudentRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments
// Fetches all enrollments for the authenticated student.

enrollmentStudentRouter.get(
    "/",
    enrollmentRatelimiter.fetchStudentEnrollmentsRateLimiter,
    ...studentAuthEngine,
    validationEngine,
    enrollmentControllers.fetchStudentEnrollments
);

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments/courses/:courseId
// Fetches the authenticated student's enrollment for the specified course.

enrollmentStudentRouter.get(
    "/courses/:courseId",
    enrollmentRatelimiter.fetchStudentEnrollmentByCourseRateLimiter,
    ...studentAuthEngine,
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

enrollmentStudentRouter.get(
    "/:enrollmentId",
    enrollmentRatelimiter.fetchStudentCurrentEnrollmentRateLimiter,
    ...studentAuthEngine,
    validateMongoIdParam({
        paramName: "enrollmentId",
        fieldName: "Enrollment ID",
    }),
    validationEngine,
    enrollmentControllers.fetchStudentCurrentEnrollment
);

///////////////////////////////////////////////////////////////
// export

export default enrollmentStudentRouter;
