import express from "express";
import validationEngine from "../../middlewares/validation.middleware.js";
import * as authMiddlewares from "../../middlewares/auth.middleware.js";
import * as courseControllers from "./course.controllers.js";
import * as courseValidations from "./course.validators.js";
import { ROLES } from "../user/user.constants.js";
import { imageUpload } from "../../middlewares/multer/multer.middleware.js";
import { FILE_FIELDS } from "../../middlewares/multer/multer.constants.js";
import {
    courseCreationRateLimiter,
    courseDeletionRateLimiter,
    courseUpdationRateLimiter,
    fetchCoursesRateLimiter,
    fetchCurrentCourseRateLimiter,
    publishCourseRateLimiter,
    saveCourseAsDraftRateLimiter,
    thumbnailUpdationRateLimiter,
} from "../../middlewares/ratelimiter/ratelimit.middleware.js";
import { validateMongoIdParam } from "../../validations/common.validators.js";

const courseRouter = express.Router();

///////////////////////////////////////////////////////////////
// new course creation route

courseRouter.post(
    "/",
    courseCreationRateLimiter,
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
    thumbnailUpdationRateLimiter,
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
    courseUpdationRateLimiter,
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
    courseDeletionRateLimiter,
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
    fetchCoursesRateLimiter,
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
