import express from "express";
import * as authMiddlewares from "../../middlewares/auth/auth.middleware.js";
import * as sectionControllers from "./section.controllers.js";
import * as sectionValidations from "./section.validators.js";
import validationEngine from "../../middlewares/validation.middleware.js";
import { ROLES } from "../user/user.constants.js";
import { validateMongoIdParam } from "../../validations/common.validators.js";
import {
    createSectionRateLimiter,
    updateSectionRateLimiter,
    removeSectionRateLimiter,
    reorderSectionsRateLimiter,
    publishSectionRateLimiter,
    saveSectionAsDraftRateLimiter,
    fetchInstructorSectionRateLimiter,
    fetchInstructorSectionsRateLimiter,
} from "../../middlewares/ratelimiter/limiters/section.ratelimit.js";

///////////////////////////////////////////////////////////////
// create router

const sectionRouter = express.Router();

//
//
//  ------------------------------------------------
//   PRIVATE ROUTES [ INSTRUCTOR ] only
//  ------------------------------------------------
//
//

///////////////////////////////////////////////////////////////
// authentication & authorization middleware

sectionRouter.use(
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail
);

///////////////////////////////////////////////////////////////
// GET /api/v1/sections/course/:courseId
// Retrieves all sections of an instructor-owned course.

sectionRouter.get(
    "/course/:courseId",
    fetchInstructorSectionsRateLimiter,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    sectionControllers.fetchInstructorSections
);

///////////////////////////////////////////////////////////////
// POST /api/v1/sections/course/:courseId
// Creates a new section inside an instructor-owned course.

sectionRouter.post(
    "/course/:courseId",
    createSectionRateLimiter,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    sectionValidations.createSection,
    validationEngine,
    sectionControllers.createSection
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/sections/course/:courseId/reorder
// Reorders sections of an instructor-owned course.

sectionRouter.patch(
    "/courses/:courseId/reorder",
    reorderSectionsRateLimiter,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    sectionValidations.reorderSections,
    validationEngine,
    sectionControllers.reorderSections
);

///////////////////////////////////////////////////////////////
// GET /api/v1/sections/:sectionId
// Retrieves a specific instructor-owned section.

sectionRouter.get(
    "/:sectionId",
    fetchInstructorSectionRateLimiter,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    sectionControllers.fetchInstructorSection
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/sections/:sectionId
// Updates an instructor-owned section.

sectionRouter.patch(
    "/:sectionId",
    updateSectionRateLimiter,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    sectionValidations.updateSection,
    validationEngine,
    sectionControllers.updateSection
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/sections/:sectionId/publish
// Publishes an instructor-owned section.

sectionRouter.patch(
    "/:sectionId/publish",
    publishSectionRateLimiter,
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

sectionRouter.patch(
    "/:sectionId/draft",
    saveSectionAsDraftRateLimiter,
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

sectionRouter.delete(
    "/:sectionId",
    removeSectionRateLimiter,
    validateMongoIdParam({
        paramName: "sectionId",
        fieldName: "Section ID",
    }),
    validationEngine,
    sectionControllers.removeSection
);

///////////////////////////////////////////////////////////////
// exports

export default sectionRouter;
