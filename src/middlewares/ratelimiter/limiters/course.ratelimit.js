import createRateLimiter from "../ratelimit.utility.js";
import { RATE_LIMIT } from "../ratelimit.constants.js";

///////////////////////////////////////////////////////////////
// create course limiter

export const createCourseRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.CREATE.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.CREATE.LIMIT,
    resource: "course creation",
});

///////////////////////////////////////////////////////////////
// update course limiter

export const updateCourseRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.UPDATE.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.UPDATE.LIMIT,
    resource: "course update",
});

///////////////////////////////////////////////////////////////
// update thumbnail limiter

export const updateCourseThumbnailRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.UPDATE_THUMBNAIL.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.UPDATE_THUMBNAIL.LIMIT,
    resource: "course thumbnail update",
});

///////////////////////////////////////////////////////////////
// remove course limiter

export const removeCourseRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.DELETE.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.DELETE.LIMIT,
    resource: "course deletion",
});

///////////////////////////////////////////////////////////////
// publish course limiter

export const publishCourseRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.CHANGE_STATUS.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.CHANGE_STATUS.LIMIT,
    resource: "course publishing",
});

///////////////////////////////////////////////////////////////
// save course as draft limiter

export const saveCourseAsDraftRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.CHANGE_STATUS.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.CHANGE_STATUS.LIMIT,
    resource: "course draft update",
});

///////////////////////////////////////////////////////////////
// fetch course limiter

export const fetchCourseRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.FETCH_LIST.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.FETCH_LIST.LIMIT,
    resource: "course listing",
});

///////////////////////////////////////////////////////////////
// fetch current course limiter

export const fetchCurrentCourseRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.FETCH_ONE.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.FETCH_ONE.LIMIT,
    resource: "course details",
});

///////////////////////////////////////////////////////////////
// fetch instructor course limiter

export const fetchInstructorCourseRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.FETCH_ONE.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.FETCH_ONE.LIMIT,
    resource: "instructor course",
});

///////////////////////////////////////////////////////////////
// fetch instructors all course course limiter

export const fetchInstructorCoursesRateLimiter = createRateLimiter({
    window: RATE_LIMIT.COURSE.FETCH_LIST.WINDOW_MS,
    limit: RATE_LIMIT.COURSE.FETCH_LIST.LIMIT,
    resource: "instructor courses",
});
