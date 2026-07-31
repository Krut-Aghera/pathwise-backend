import { RATE_LIMIT } from "../ratelimit.constants.js";
import createRateLimiter from "../ratelimit.utility.js";

///////////////////////////////////////////////////////////////
// create lecture limiter

export const createLectureRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.CREATE.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.CREATE.LIMIT,
    resource: "lecture creation",
});

///////////////////////////////////////////////////////////////
// update lecture limiter

export const updateLectureRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.UPDATE.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.UPDATE.LIMIT,
    resource: "lecture update",
});

///////////////////////////////////////////////////////////////
// remove lecture limiter

export const removeLectureRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.DELETE.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.DELETE.LIMIT,
    resource: "lecture deletion",
});

///////////////////////////////////////////////////////////////
// reorder lectures limiter

export const reorderLecturesRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.REORDER.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.REORDER.LIMIT,
    resource: "lecture reordering",
});

///////////////////////////////////////////////////////////////
// publish lecture limiter

export const publishLectureRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.CHANGE_STATUS.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.CHANGE_STATUS.LIMIT,
    resource: "lecture publishing",
});

///////////////////////////////////////////////////////////////
// save lecture as draft limiter

export const saveLectureAsDraftRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.CHANGE_STATUS.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.CHANGE_STATUS.LIMIT,
    resource: "lecture draft",
});

///////////////////////////////////////////////////////////////
// upload lecture video limiter

export const uploadLectureVideoRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.UPLOAD_VIDEO.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.UPLOAD_VIDEO.LIMIT,
    resource: "lecture video upload",
});

///////////////////////////////////////////////////////////////
// remove lecture video limiter

export const removeLectureVideoRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.REMOVE_VIDEO.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.REMOVE_VIDEO.LIMIT,
    resource: "lecture video removal",
});

///////////////////////////////////////////////////////////////
// fetch instructor lecture limiter

export const fetchInstructorLectureRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.FETCH_ONE.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.FETCH_ONE.LIMIT,
    resource: "lecture retrieval",
});

///////////////////////////////////////////////////////////////
// fetch instructor lectures limiter

export const fetchInstructorLecturesRateLimiter = createRateLimiter({
    window: RATE_LIMIT.LECTURE.FETCH_LIST.WINDOW_MS,
    limit: RATE_LIMIT.LECTURE.FETCH_LIST.LIMIT,
    resource: "lecture list retrieval",
});
