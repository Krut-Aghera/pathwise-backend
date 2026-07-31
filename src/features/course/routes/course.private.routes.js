import express from "express";
import * as courseControllers from "../course.controllers.js";
import * as courseValidations from "../course.validators.js";
import * as courseRatelimiter from "../../../middlewares/ratelimiter/limiters/course.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import instructorAuthMiddleware from "../../../middlewares/auth/instructor-auth.middleware.js";
import { validateMongoIdParam } from "../../../validations/common.validators.js";
import { FILE_FIELDS } from "../../../middlewares/multer/multer.constants.js";
import { imageUpload } from "../../../middlewares/multer/multer.uploaders.js";

///////////////////////////////////////////////////////////////
// create router

const coursePrivateRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/courses/instructor
// Retrieves all courses owned by the authenticated instructor.

coursePrivateRouter.get(
    "/",
    courseRatelimiter.fetchInstructorCoursesRateLimiter,
    ...instructorAuthMiddleware,
    courseValidations.fetchInstructorCoursesValidators,
    validationEngine,
    courseControllers.fetchInstructorCourses
);

///////////////////////////////////////////////////////////////
// GET /api/v1/courses/instructor/:courseId
// Retrieves a specific course owned by the authenticated instructor.

coursePrivateRouter.get(
    "/:courseId",
    courseRatelimiter.fetchInstructorCourseRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.fetchInstructorCourse
);

///////////////////////////////////////////////////////////////
// POST /api/v1/courses/instructor
// Creates a new course for the authenticated instructor.

coursePrivateRouter.post(
    "/",
    courseRatelimiter.createCourseRateLimiter,
    ...instructorAuthMiddleware,
    imageUpload.single(FILE_FIELDS.THUMBNAIL),
    courseValidations.createCourseValidators,
    validationEngine,
    courseControllers.createCourse
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/instructor/:courseId/thumbnail
// Updates the thumbnail image of an instructor-owned course.

coursePrivateRouter.patch(
    "/:courseId/thumbnail",
    courseRatelimiter.updateCourseThumbnailRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    imageUpload.single(FILE_FIELDS.THUMBNAIL),
    courseControllers.updateThumbnail
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/instructor/:courseId
// Updates the details of an instructor-owned course.

coursePrivateRouter.patch(
    "/:courseId",
    courseRatelimiter.updateCourseRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    courseValidations.updateCourseValidators,
    validationEngine,
    courseControllers.updateCourse
);

///////////////////////////////////////////////////////////////
// DELETE /api/v1/courses/instructor/:courseId
// Soft deletes an instructor-owned course.

coursePrivateRouter.delete(
    "/:courseId",
    courseRatelimiter.removeCourseRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.removeCourse
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/instructor/:courseId/publish
// Publishes an instructor-owned course.

coursePrivateRouter.patch(
    "/:courseId/publish",
    courseRatelimiter.publishCourseRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.publishCourse
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/instructor/:courseId/draft
// Saves an instructor-owned course as a draft.

coursePrivateRouter.patch(
    "/:courseId/draft",
    courseRatelimiter.saveCourseAsDraftRateLimiter,
    ...instructorAuthMiddleware,
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
