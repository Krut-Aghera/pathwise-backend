import express from "express";

import * as dashboardControllers from "./dashboard.controller.js";
import * as dashboardRateLimiter from "../../middlewares/ratelimiter/limiters/dashboard.ratelimit.js";

import {
    adminAuthEngine,
    instructorAuthEngine,
    userAuthEngine,
} from "../../middlewares/auth/auth.middleware.engines.js";
import validationEngine from "../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../validations/mongo-idParam.validator.js";

////////////////////////////////////////////////////////////////
// dashboard router

const dashboardRouter = express.Router();

////////////////////////////////////////////////////////////////
// instructor dashboard

// GET /api/v1/dashboard/instructors/:instructorId
// Retrieves dashboard statistics for the authenticated instructor.

dashboardRouter.get(
    "/instructors/:instructorId",
    dashboardRateLimiter.fetchInstructorDashboardRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "instructorId",
        fieldName: "Instructor ID",
    }),
    validationEngine,
    dashboardControllers.fetchInstructorDashboard
);

////////////////////////////////////////////////////////////////
// student dashboard

// GET /api/v1/dashboard/students/:studentId
// Retrieves dashboard statistics for the authenticated student.

dashboardRouter.get(
    "/students/:studentId",
    dashboardRateLimiter.fetchStudentDashboardRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "studentId",
        fieldName: "Student ID",
    }),
    validationEngine,
    dashboardControllers.fetchStudentDashboard
);

////////////////////////////////////////////////////////////////
// admin dashboard

// GET /api/v1/dashboard/admin/:adminId
// Retrieves dashboard statistics for the authenticated admin.

dashboardRouter.get(
    "/admins/:adminId",
    dashboardRateLimiter.fetchAdminDashboardRateLimiter,
    ...adminAuthEngine,
    validateMongoIdParam({
        paramName: "adminId",
        fieldName: "Admin ID",
    }),
    validationEngine,
    dashboardControllers.fetchAdminDashboard
);

export default dashboardRouter;
