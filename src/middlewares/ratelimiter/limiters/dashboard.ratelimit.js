import { DASHBOARD_RT } from "../ratelimit.constants.js";
import createRateLimiter from "../ratelimit.utility.js";

////////////////////////////////////////////////////////////////
// instructor dashboard limiter

export const fetchInstructorDashboardRateLimiter = createRateLimiter({
    window: DASHBOARD_RT.INSTRUCTOR.WINDOW_MS,
    limit: DASHBOARD_RT.INSTRUCTOR.LIMIT,
    resource: "instructor dashboard",
});

////////////////////////////////////////////////////////////////
// student dashboard limiter

export const fetchStudentDashboardRateLimiter = createRateLimiter({
    window: DASHBOARD_RT.STUDENT.WINDOW_MS,
    limit: DASHBOARD_RT.STUDENT.LIMIT,
    resource: "student dashboard",
});

////////////////////////////////////////////////////////////////
// admin dashboard limiter

export const fetchAdminDashboardRateLimiter = createRateLimiter({
    window: DASHBOARD_RT.ADMIN.WINDOW_MS,
    limit: DASHBOARD_RT.ADMIN.LIMIT,
    resource: "admin dashboard",
});
