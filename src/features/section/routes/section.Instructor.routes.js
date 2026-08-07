import express from "express";

import * as sectionControllers from "../section.controllers.js";
import * as sectionValidations from "../section.validators.js";
import * as sectionRatelimiter from "../../../middlewares/ratelimiter/limiters/section.ratelimit.js";

import instructorAuthMiddleware from "../../../middlewares/auth/instructor-auth.middleware.js";
import validationEngine from "../../../middlewares/validation.middleware.js";

import { validateMongoIdParam } from "../../../validations/common.validators.js";
import { ROLES } from "../../user/user.constants.js";

///////////////////////////////////////////////////////////////
// create router

const sectionInstructorRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/sections/course/:courseId
// Retrieves all sections of an instructor-owned course.

sectionInstructorRouter.get(
    "/course/:courseId",
    sectionRatelimiter.fetchInstructorSectionsRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    sectionControllers.fetchCourseSections
);

///////////////////////////////////////////////////////////////
// GET /api/v1/sections/:sectionId
// Retrieves a specific instructor-owned section.

sectionInstructorRouter.get(
    "/:sectionId",
    sectionRatelimiter.fetchInstructorSectionRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    sectionControllers.fetchInstructorSection
);

///////////////////////////////////////////////////////////////
// POST /api/v1/sections/course/:courseId
// Creates a new section inside an instructor-owned course.

sectionInstructorRouter.post(
    "/course/:courseId",
    sectionRatelimiter.createSectionRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    sectionValidations.createSectionValidators,
    validationEngine,
    sectionControllers.createSection
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/sections/course/:courseId/reorder
// Reorders sections of an instructor-owned course.

sectionInstructorRouter.patch(
    "/courses/:courseId/reorder",
    sectionRatelimiter.reorderSectionsRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    sectionValidations.reorderSectionValidators,
    validationEngine,
    sectionControllers.reorderSections
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/sections/:sectionId
// Updates an instructor-owned section.

sectionInstructorRouter.patch(
    "/:sectionId",
    sectionRatelimiter.updateSectionRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    sectionValidations.updateSectionValidators,
    validationEngine,
    sectionControllers.updateSection
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/sections/:sectionId/publish
// Publishes an instructor-owned section.

sectionInstructorRouter.patch(
    "/:sectionId/publish",
    sectionRatelimiter.publishSectionRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    sectionControllers.publishSection
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/sections/:sectionId/draft
// Saves an instructor-owned section as draft.

sectionInstructorRouter.patch(
    "/:sectionId/draft",
    sectionRatelimiter.saveSectionAsDraftRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    sectionControllers.saveSectionAsDraft
);

///////////////////////////////////////////////////////////////
// DELETE /api/v1/sections/:sectionId
// Soft deletes an instructor-owned section.

sectionInstructorRouter.delete(
    "/:sectionId",
    sectionRatelimiter.removeSectionRateLimiter,
    ...instructorAuthMiddleware,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    sectionControllers.removeSection
);

///////////////////////////////////////////////////////////////
// exports

export default sectionInstructorRouter;
