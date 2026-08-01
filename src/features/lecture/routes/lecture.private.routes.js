import express from "express";
import * as lectureControllers from "../lecture.controllers.js";
import * as lectureValidations from "../lecture.validators.js";
import * as lectureRatelimiter from "../../../middlewares/ratelimiter/limiters/lecture.rate-limiter.js";
import instructorAuthMiddleware from "../../../middlewares/auth/instructor-auth.middleware.js";
import { validateMongoIdParam } from "../../../validations/common.validators.js";
import { videoUpload } from "../../../middlewares/multer/multer.uploaders.js";
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
// PATCH /api/v1/lectures/sections/:sectionId/reorder
// Reorders all lectures within the specified section.

lecturePrivateRouter.patch(
    "/sections/:sectionId/reorder",
    lectureRatelimiter.reorderLecturesRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    lectureControllers.reorderLectures
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/lectures/:lectureId/video
// Uploads or replaces the lecture video.

lecturePrivateRouter.patch(
    "/:lectureId/video",
    lectureRatelimiter.uploadLectureVideoRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    videoUpload.single("video"),
    validationEngine,
    lectureControllers.uploadLectureVideo
);

///////////////////////////////////////////////////////////////
// DELETE /api/v1/lectures/:lectureId/video
// Removes the video from the specified lecture.

lecturePrivateRouter.delete(
    "/:lectureId/video",
    lectureRatelimiter.removeLectureVideoRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.removeLectureVideo
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/lectures/:lectureId/publish
// Publishes the specified lecture.

lecturePrivateRouter.patch(
    "/:lectureId/publish",
    lectureRatelimiter.publishLectureRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.publishLecture
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/lectures/:lectureId/draft
// Saves the specified lecture as a draft.

lecturePrivateRouter.patch(
    "/:lectureId/draft",
    lectureRatelimiter.saveLectureAsDraftRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.saveLectureAsDraft
);

///////////////////////////////////////////////////////////////
// export

export default lecturePrivateRouter;
