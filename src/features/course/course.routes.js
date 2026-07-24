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
    publishCourseRateLimiter,
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
// export

export default courseRouter;
