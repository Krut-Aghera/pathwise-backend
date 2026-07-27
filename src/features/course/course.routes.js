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
const instructorRouter = express.Router();

//
//
//  ------------------------------------------------
//   PRIVATE ROUTES [ INSTRUCTOR ] only
//  ------------------------------------------------
//
//

///////////////////////////////////////////////////////////////
// GET /api/v1/courses/instructor
// Retrieves all courses owned by the authenticated instructor.

instructorRouter.get(
    "/",
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
// GET /api/v1/courses/instructor/:courseId
// Retrieves a specific course owned by the authenticated instructor.

instructorRouter.get(
    "/:courseId",
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
// POST /api/v1/courses/instructor
// Creates a new course for the authenticated instructor.

instructorRouter.post(
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
// PATCH /api/v1/courses/instructor/:courseId/thumbnail
// Updates the thumbnail image of an instructor-owned course.

instructorRouter.patch(
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
// PATCH /api/v1/courses/instructor/:courseId
// Updates the details of an instructor-owned course.

instructorRouter.patch(
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
// DELETE /api/v1/courses/instructor/:courseId
// Soft deletes an instructor-owned course.

instructorRouter.delete(
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
// PATCH /api/v1/courses/instructor/:courseId/publish
// Publishes an instructor-owned course.

instructorRouter.patch(
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
// PATCH /api/v1/courses/instructor/:courseId/draft
// Saves an instructor-owned course as a draft.

instructorRouter.patch(
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

//
//
//  ----------------------------------------------------------
//  mounting sub-router (Instructor router) into main router (course router)
//  ----------------------------------------------------------
//
//

courseRouter.use("/instructor", instructorRouter);

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

///////////////////////////////////////////////////////////////
// export

export default courseRouter;
