import express from "express";
import * as lectureControllers from "../lecture.controllers.js";
import * as lectureValidations from "../lecture.validators.js";
import * as lectureRatelimiter from "../../../middlewares/ratelimiter/limiters/lecture.rate-limiter.js";
import instructorAuthMiddleware from "../../../middlewares/auth/instructor-auth.middleware.js";
import { validateMongoIdParam } from "../../../validations/common.validators.js";
import validationEngine from "../../../middlewares/validation.middleware.js";

///////////////////////////////////////////////////////////////
// create router

const lecturePrivateRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/lectures/sections/:sectionId
// Creates a new lecture in the specified section.

lecturePrivateRouter.post(
    "/sections/:sectionId",
    lectureRatelimiter.createLectureRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    lectureValidations.createLectureValidators,
    validationEngine,
    lectureControllers.createLecture
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/lectures/:lectureId
// Updates the specified lecture.

lecturePrivateRouter.patch(
    "/:lectureId",
    lectureRatelimiter.updateLectureRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    lectureValidations.updateLectureValidators,
    validationEngine,
    lectureControllers.updateLecture
);

///////////////////////////////////////////////////////////////
// DELETE /api/v1/lectures/:lectureId
// Soft deletes the specified lecture.

lecturePrivateRouter.delete(
    "/:lectureId",
    lectureRatelimiter.removeLectureRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.removeLecture
);

///////////////////////////////////////////////////////////////
// export

export default lecturePrivateRouter;
