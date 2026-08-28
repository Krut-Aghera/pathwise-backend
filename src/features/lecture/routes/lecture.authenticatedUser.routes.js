import express from "express";
import * as lectureControllers from "../lecture.controllers.js";
import * as lectureRatelimiter from "../../../middlewares/ratelimiter/limiters/lecture.rate-limiter.js";
import { userAuthEngine } from "../../../middlewares/auth/auth.middleware.engines.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const lectureAuthenticatedUser = express.Router();

// GET /api/v1/lectures/:lectureId/learn
// Fetches a lecture for an enrolled student.

lectureAuthenticatedUser.get(
    "/:lectureId/learn",
    lectureRatelimiter.fetchStudentLectureRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.fetchStudentLecture
);

///////////////////////////////////////////////////////////////
// export

export default lectureAuthenticatedUser;
