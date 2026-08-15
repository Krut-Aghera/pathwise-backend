import express from "express";
import * as lectureControllers from "../lecture.controllers.js";
import * as lectureRatelimiter from "../../../middlewares/ratelimiter/limiters/lecture.rate-limiter.js";
import studentAuthMiddleware from "../../../middlewares/auth/student-auth.middleware.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const lectureStudentRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/students/lectures/:lectureId
// Fetches the specified lecture for the authenticated enrolled student.

lectureStudentRouter.get(
    "/:lectureId",
    lectureRatelimiter.fetchStudentLectureRateLimiter,
    ...studentAuthMiddleware,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.fetchStudentLecture
);

///////////////////////////////////////////////////////////////
// export

export default lectureStudentRouter;
