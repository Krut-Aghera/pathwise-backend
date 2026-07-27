import express from "express";
import validationEngine from "../../middlewares/validation.middleware.js";
import * as authMiddlewares from "../../middlewares/auth.middleware.js";
import * as courseControllers from "./course.controllers.js";
import * as courseValidations from "./course.validators.js";
import { ROLES } from "../user/user.constants.js";
import { imageUpload } from "../../middlewares/multer/multer.uploaders.js";
import { FILE_FIELDS } from "../../middlewares/multer/multer.constants.js";
import { validateMongoIdParam } from "../../validations/common.validators.js";
import {
    createCourseRateLimiter,
    removeCourseRateLimiter,
    fetchCourseRateLimiter,
    fetchCurrentCourseRateLimiter,
    fetchInstructorCourseRateLimiter,
    publishCourseRateLimiter,
    saveCourseAsDraftRateLimiter,
    updateCourseRateLimiter,
    updateCourseThumbnailRateLimiter,
    fetchInstructorCoursesRateLimiter,
} from "../../middlewares/ratelimiter/limiters/course.ratelimit.js";

///////////////////////////////////////////////////////////////
// create router

const courseRouter = express.Router();

//
//
//  ------------------------------------------------
//   PUBLIC ROUTES
//  ------------------------------------------------
//
//

///////////////////////////////////////////////////////////////
// GET /api/v1/courses
// Retrieves publicly available courses with pagination,
// searching, filtering, and sorting support.

courseRouter.get(
    "/",
    fetchCourseRateLimiter,
    courseValidations.fetchCoursesValidator,
    validationEngine,
    courseControllers.fetchCourses
);

///////////////////////////////////////////////////////////////
// GET /api/v1/courses/:courseId
// Retrieves the public details of a specific course.

courseRouter.get(
    "/:courseId",
    fetchCurrentCourseRateLimiter,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.fetchCurrentCourse
);

//
//
//  ------------------------------------------------
//   PRIVATE ROUTES [ INSTRUCTOR ] only
//  ------------------------------------------------
//
//

///////////////////////////////////////////////////////////////
// GET /api/v1/courses/me/:courseId
// Retrieves a specific course owned by the authenticated instructor.

courseRouter.get(
    "/me/:courseId",
    fetchInstructorCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.fetchInstructorCourse
);

///////////////////////////////////////////////////////////////
// GET /api/v1/courses/me
// Retrieves all courses owned by the authenticated instructor.

courseRouter.get(
    "/me",
    fetchInstructorCoursesRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    courseValidations.fetchInstructorCoursesValidator,
    validationEngine,
    courseControllers.fetchInstructorCourses
);

///////////////////////////////////////////////////////////////
// POST /api/v1/courses
// Creates a new course for the authenticated instructor.

courseRouter.post(
    "/",
    createCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    imageUpload.single(FILE_FIELDS.THUMBNAIL),
    courseValidations.createCourse,
    validationEngine,
    courseControllers.createCourse
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/:courseId/thumbnail
// Updates the thumbnail image of an instructor-owned course.

courseRouter.patch(
    "/:courseId/thumbnail",
    updateCourseThumbnailRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    imageUpload.single(FILE_FIELDS.THUMBNAIL),
    courseControllers.updateThumbnail
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/:courseId
// Updates the details of an instructor-owned course.

courseRouter.patch(
    "/:courseId",
    updateCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    courseValidations.updateCourse,
    validationEngine,
    courseControllers.updateCourse
);

///////////////////////////////////////////////////////////////
// DELETE /api/v1/courses/:courseId
// Soft deletes an instructor-owned course.

courseRouter.delete(
    "/:courseId",
    removeCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.removeCourse
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/:courseId/publish
// Publishes an instructor-owned course.

courseRouter.patch(
    "/:courseId/publish",
    publishCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.publishCourse
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/courses/:courseId/draft
// Saves an instructor-owned course as a draft.

courseRouter.patch(
    "/:courseId/draft",
    saveCourseAsDraftRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.saveCourseAsDraft
);

///////////////////////////////////////////////////////////////
// export

export default courseRouter;
