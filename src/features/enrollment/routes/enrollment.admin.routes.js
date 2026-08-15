import express from "express";
import * as enrollmentControllers from "../enrollment.controllers.js";
import * as enrollmentRatelimiter from "../../../middlewares/ratelimiter/limiters/enrollment.ratelimit.js";
import adminAuthMiddleware from "../../../middlewares/auth/admin-auth.middleware.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const enrollmentAdminRouter = express.Router();

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments/admins
// Fetches all enrollments.

enrollmentAdminRouter.get(
    "/",
    enrollmentRatelimiter.fetchAllEnrollmentsRateLimiter,
    ...adminAuthMiddleware,
    validationEngine,
    enrollmentControllers.fetchAllEnrollments
);

///////////////////////////////////////////////////////////////
// GET /api/v1/enrollments/admins/:enrollmentId
// Fetches a specific enrollment.

enrollmentAdminRouter.get(
    "/:enrollmentId",
    enrollmentRatelimiter.fetchCurrentEnrollmentRateLimiter,
    ...adminAuthMiddleware,
    validateMongoIdParam({
        paramName: "enrollmentId",
        fieldName: "Enrollment ID",
    }),
    validationEngine,
    enrollmentControllers.fetchCurrentEnrollment
);

///////////////////////////////////////////////////////////////
// export

export default enrollmentAdminRouter;
