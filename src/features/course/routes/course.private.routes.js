import express from "express";
import * as courseControllers from "../course.controllers.js";
import * as courseValidations from "../course.validators.js";
import * as courseRatelimiter from "../../../middlewares/ratelimiter/limiters/course.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import instructorAuthEngine from "../../../middlewares/auth/engines/instructor-auth.engine.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import { FILE_FIELDS } from "../../../middlewares/multer/multer.constants.js";
import { imageUpload } from "../../../middlewares/multer/multer.uploaders.js";

///////////////////////////////////////////////////////////////
// create router

const coursePrivateRouter = express.Router();
// GET /api/v1/courses/mine
// Retrieves all courses owned by the authenticated instructor.

coursePrivateRouter.get(
    "/mine",
    courseRatelimiter.fetchInstructorCoursesRateLimiter,
    ...instructorAuthEngine,
    courseValidations.fetchInstructorCoursesValidators,
    validationEngine,
    courseControllers.fetchInstructorCourses
);

// GET /api/v1/courses/mine/:courseId
// Retrieves a specific course owned by the authenticated instructor.

coursePrivateRouter.get(
    "/mine/:courseId",
    courseRatelimiter.fetchInstructorCourseRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.fetchInstructorCourse
);

// POST /api/v1/courses
// Creates a new course for the authenticated instructor.

coursePrivateRouter.post(
    "/",
    courseRatelimiter.createCourseRateLimiter,
    ...instructorAuthEngine,
    imageUpload.single(FILE_FIELDS.THUMBNAIL),
    courseValidations.createCourseValidators,
    validationEngine,
    courseControllers.createCourse
);

// PATCH /api/v1/courses/:courseId
// Updates the details of an instructor-owned course.

coursePrivateRouter.patch(
    "/:courseId",
    courseRatelimiter.updateCourseRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    courseValidations.updateCourseValidators,
    validationEngine,
    courseControllers.updateCourse
);

// PATCH /api/v1/courses/:courseId/thumbnail
// Updates the thumbnail image of an instructor-owned course.

coursePrivateRouter.patch(
    "/:courseId/thumbnail",
    courseRatelimiter.updateCourseThumbnailRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    imageUpload.single(FILE_FIELDS.THUMBNAIL),
    courseControllers.updateThumbnail
);

// DELETE /api/v1/courses/:courseId
// Soft deletes an instructor-owned course.

coursePrivateRouter.delete(
    "/:courseId",
    courseRatelimiter.removeCourseRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.removeCourse
);

// POST /api/v1/courses/:courseId/publish
// Publishes an instructor-owned course.

coursePrivateRouter.post(
    "/:courseId/publish",
    courseRatelimiter.publishCourseRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.publishCourse
);

// POST /api/v1/courses/:courseId/draft
// Saves an instructor-owned course as a draft.

coursePrivateRouter.post(
    "/:courseId/draft",
    courseRatelimiter.saveCourseAsDraftRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.saveCourseAsDraft
);
///////////////////////////////////////////////////////////////
// export

export default coursePrivateRouter;
