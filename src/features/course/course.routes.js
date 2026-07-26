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
} from "../../middlewares/ratelimiter/limiters/course.ratelimit.js";

const courseRouter = express.Router();

///////////////////////////////////////////////////////////////
// new course creation route

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
// thumbnail updation route

courseRouter.patch(
    "/:id/thumbnail",
    updateCourseThumbnailRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    imageUpload.single(FILE_FIELDS.THUMBNAIL),
    courseControllers.updateThumbnail
);

///////////////////////////////////////////////////////////////
// Update course details

courseRouter.patch(
    "/:id",
    updateCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "id",
        fieldName: "Course ID",
    }),
    courseValidations.updateCourse,
    validationEngine,
    courseControllers.updateCourse
);

///////////////////////////////////////////////////////////////
// Delete course

courseRouter.delete(
    "/:id",
    removeCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "id",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.removeCourse
);

///////////////////////////////////////////////////////////////
// publish course route

courseRouter.patch(
    "/:id/publish",
    publishCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "id",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.publishCourse
);

///////////////////////////////////////////////////////////////
// Save course as draft

courseRouter.patch(
    "/:id/draft",
    saveCourseAsDraftRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "id",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.saveCourseAsDraft
);

///////////////////////////////////////////////////////////////
// fetch instructor course

courseRouter.get(
    "/:id/me",
    fetchInstructorCourseRateLimiter,
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
    validateMongoIdParam({
        paramName: "id",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.fetchInstructorCourse
);

///////////////////////////////////////////////////////////////
// fetch course // public

courseRouter.get(
    "/",
    fetchCourseRateLimiter,
    courseValidations.fetchCoursesValidator,
    validationEngine,
    courseControllers.fetchCourses
);

///////////////////////////////////////////////////////////////
// fetch current course // public

courseRouter.get(
    "/:id",
    fetchCurrentCourseRateLimiter,
    validateMongoIdParam({
        paramName: "id",
        fieldName: "Course ID",
    }),
    validationEngine,
    courseControllers.fetchCurrentCourse
);

///////////////////////////////////////////////////////////////
// export

export default courseRouter;
