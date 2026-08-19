import { PROGRESS_RT } from "../ratelimit.constants.js";
import createRateLimiter from "../ratelimit.utility.js";

///////////////////////////////////////////////////////////////
// fetch progress limiter

export const fetchProgressRateLimiter = createRateLimiter({
    window: PROGRESS_RT.FETCH.WINDOW_MS,
    limit: PROGRESS_RT.FETCH.LIMIT,
    resource: "progress fetch",
});

////////////////////////////////////////////////////////////////
// initialize lecture progress limiter

export const initializeLectureProgressRateLimiter = createRateLimiter({
    window: PROGRESS_RT.INITIALIZE.WINDOW_MS,
    limit: PROGRESS_RT.INITIALIZE.LIMIT,
    resource: "lecture progress initialization",
});

///////////////////////////////////////////////////////////////
// update progress limiter

export const updateProgressRateLimiter = createRateLimiter({
    window: PROGRESS_RT.UPDATE.WINDOW_MS,
    limit: PROGRESS_RT.UPDATE.LIMIT,
    resource: "progress update",
});

///////////////////////////////////////////////////////////////
// update lecture completion progress limiter

export const updateLectureCompletionProgressRateLimiter = createRateLimiter({
    window: PROGRESS_RT.COMPLETE.WINDOW_MS,
    limit: PROGRESS_RT.COMPLETE.LIMIT,
    resource: "lecture completion",
});
