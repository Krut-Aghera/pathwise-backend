import express from "express";
import * as lectureControllers from "../lecture.controllers.js";
import * as lectureValidations from "../lecture.validators.js";
import * as lectureRatelimiter from "../../../middlewares/ratelimiter/limiters/lecture.rate-limiter.js";
import instructorAuthEngine from "../../../middlewares/auth/engines/instructor-auth.engine.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import { videoUpload } from "../../../middlewares/multer/multer.uploaders.js";
import validationEngine from "../../../middlewares/validation.middleware.js";

///////////////////////////////////////////////////////////////
// create router

const lectureInstructorRouter = express.Router();

// POST /api/v1/lectures/sections/:sectionId
// Creates a new lecture in the specified section.

lectureInstructorRouter.post(
    "/sections/:sectionId",
    lectureRatelimiter.createLectureRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    lectureValidations.createLectureValidators,
    validationEngine,
    lectureControllers.createLecture
);

// GET /api/v1/lectures/sections/:sectionId
// Fetches all lectures in the specified section for the authenticated instructor.

lectureInstructorRouter.get(
    "/sections/:sectionId",
    lectureRatelimiter.fetchInstructorLecturesRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    lectureControllers.fetchSectionLectures
);

// GET /api/v1/lectures/:lectureId
// Fetches the specified lecture for the authenticated instructor.

lectureInstructorRouter.get(
    "/:lectureId",
    lectureRatelimiter.fetchInstructorLectureRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.fetchInstructorLecture
);

// PATCH /api/v1/lectures/:lectureId
// Updates an instructor-owned lecture.

lectureInstructorRouter.patch(
    "/:lectureId",
    lectureRatelimiter.updateLectureRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    lectureValidations.updateLectureValidators,
    validationEngine,
    lectureControllers.updateLecture
);

// DELETE /api/v1/lectures/:lectureId
// Soft deletes an instructor-owned lecture.

lectureInstructorRouter.delete(
    "/:lectureId",
    lectureRatelimiter.removeLectureRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.removeLecture
);

// PATCH /api/v1/lectures/sections/:sectionId/reorder
// Reorders lectures within an instructor-owned section.

lectureInstructorRouter.patch(
    "/sections/:sectionId/reorder",
    lectureRatelimiter.reorderLecturesRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    lectureControllers.reorderLectures
);

// PATCH /api/v1/lectures/:lectureId/video
// Uploads or replaces an instructor-owned lecture video.

lectureInstructorRouter.patch(
    "/:lectureId/video",
    lectureRatelimiter.uploadLectureVideoRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    videoUpload.single("video"),
    validationEngine,
    lectureControllers.uploadLectureVideo
);

// DELETE /api/v1/lectures/:lectureId/video
// Removes the video from an instructor-owned lecture.

lectureInstructorRouter.delete(
    "/:lectureId/video",
    lectureRatelimiter.removeLectureVideoRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.removeLectureVideo
);

// PATCH /api/v1/lectures/:lectureId/publish
// Publishes an instructor-owned lecture.

lectureInstructorRouter.patch(
    "/:lectureId/publish",
    lectureRatelimiter.publishLectureRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.publishLecture
);

// PATCH /api/v1/lectures/:lectureId/draft
// Saves an instructor-owned lecture as a draft.

lectureInstructorRouter.patch(
    "/:lectureId/draft",
    lectureRatelimiter.saveLectureAsDraftRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    validationEngine,
    lectureControllers.saveLectureAsDraft
);

///////////////////////////////////////////////////////////////
// export

export default lectureInstructorRouter;
