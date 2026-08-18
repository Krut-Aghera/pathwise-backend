import express from "express";
import * as lectureControllers from "../lecture.controllers.js";
import * as lectureRatelimiter from "../../../middlewares/ratelimiter/limiters/lecture.rate-limiter.js";
import studentAuthEngine from "../../../middlewares/auth/engines/student-auth.engine.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const lectureStudentRouter = express.Router();

// GET /api/v1/lectures/:lectureId/learn
// Fetches a lecture for an enrolled student.

lectureStudentRouter.get(
    "/:lectureId/learn",
    lectureRatelimiter.fetchStudentLectureRateLimiter,
    ...studentAuthEngine,
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
