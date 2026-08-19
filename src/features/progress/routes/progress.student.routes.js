import express from "express";

import * as progressControllers from "../progress.controllers.js";
import * as progressValidators from "../progress.validators.js";
import * as progressRatelimiter from "../../../middlewares/ratelimiter/limiters/progress.ratelimiters.js";
import studentAuthEngine from "../../../middlewares/auth/engines/student-auth.engine.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const progressStudentRouter = express.Router();

// GET /api/v1/progress/students/courses/:courseId
// Fetches the progress of the authenticated student for the specified course.

progressStudentRouter.get(
    "/courses/:courseId",
    progressRatelimiter.fetchProgressRateLimiter,
    ...studentAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    progressControllers.fetchCourseProgress
);

// POST /api/v1/progress/students/courses/:courseId/lectures/:lectureId
// Initializes progress for the specified lecture.

progressStudentRouter.post(
    "/courses/:courseId/lectures/:lectureId",
    progressRatelimiter.initializeLectureProgressRateLimiter,
    ...studentAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    progressControllers.initializeLectureProgress
);

// PATCH /api/v1/progress/students/courses/:courseId/lectures/:lectureId
// Updates the video progress of the authenticated student for the specified lecture.

progressStudentRouter.patch(
    "/courses/:courseId/lectures/:lectureId",
    progressRatelimiter.updateProgressRateLimiter,
    ...studentAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    progressValidators.updateLectureProgressValidator,
    validationEngine,
    progressControllers.updateLectureProgress
);

// POST /api/v1/progress/students/courses/:courseId/lectures/:lectureId/complete
// Marks the specified lecture as completed for the authenticated student.

progressStudentRouter.post(
    "/courses/:courseId/lectures/:lectureId/complete",
    progressRatelimiter.updateLectureCompletionProgressRateLimiter,
    ...studentAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    progressControllers.updateLectureCompletionProgress
);

///////////////////////////////////////////////////////////////
// export

export default progressStudentRouter;
