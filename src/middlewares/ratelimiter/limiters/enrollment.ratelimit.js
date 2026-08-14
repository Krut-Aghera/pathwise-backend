import createRateLimiter from "../ratelimit.utility.js";
import { ENROLLMENT_RT } from "../ratelimit.constants.js";

///////////////////////////////////////////////////////////////
// fetch student enrollments limiter

export const fetchStudentEnrollmentsRateLimiter = createRateLimiter({
    window: ENROLLMENT_RT.FETCH_LIST.WINDOW_MS,
    limit: ENROLLMENT_RT.FETCH_LIST.LIMIT,
    resource: "student enrollments fetch",
});

///////////////////////////////////////////////////////////////
// fetch student enrollment by course limiter

export const fetchStudentEnrollmentByCourseRateLimiter = createRateLimiter({
    window: ENROLLMENT_RT.FETCH_ONE.WINDOW_MS,
    limit: ENROLLMENT_RT.FETCH_ONE.LIMIT,
    resource: "student enrollment fetch",
});

///////////////////////////////////////////////////////////////
// fetch student current enrollment limiter

export const fetchStudentCurrentEnrollmentRateLimiter = createRateLimiter({
    window: ENROLLMENT_RT.FETCH_ONE.WINDOW_MS,
    limit: ENROLLMENT_RT.FETCH_ONE.LIMIT,
    resource: "student current enrollment fetch",
});

///////////////////////////////////////////////////////////////
// fetch course enrollments limiter

export const fetchCourseEnrollmentsRateLimiter = createRateLimiter({
    window: ENROLLMENT_RT.FETCH_LIST.WINDOW_MS,
    limit: ENROLLMENT_RT.FETCH_LIST.LIMIT,
    resource: "course enrollments fetch",
});

///////////////////////////////////////////////////////////////
// fetch all enrollments limiter

export const fetchAllEnrollmentsRateLimiter = createRateLimiter({
    window: ENROLLMENT_RT.FETCH_LIST.WINDOW_MS,
    limit: ENROLLMENT_RT.FETCH_LIST.LIMIT,
    resource: "all enrollments fetch",
});

///////////////////////////////////////////////////////////////
// fetch enrollment limiter

export const fetchCurrentEnrollmentRateLimiter = createRateLimiter({
    window: ENROLLMENT_RT.FETCH_ONE.WINDOW_MS,
    limit: ENROLLMENT_RT.FETCH_ONE.LIMIT,
    resource: "enrollment fetch",
});
