import { RATE_LIMIT } from "../ratelimit.constants.js";
import createRateLimiter from "../ratelimit.utility.js";

///////////////////////////////////////////////////////////////
// create section limiter

export const createSectionRateLimiter = createRateLimiter({
    window: RATE_LIMIT.SECTION.CREATE.WINDOW_MS,
    limit: RATE_LIMIT.SECTION.CREATE.LIMIT,
    resource: "section creation",
});

///////////////////////////////////////////////////////////////
// update section limiter

export const updateSectionRateLimiter = createRateLimiter({
    window: RATE_LIMIT.SECTION.UPDATE.WINDOW_MS,
    limit: RATE_LIMIT.SECTION.UPDATE.LIMIT,
    resource: "section update",
});

///////////////////////////////////////////////////////////////
// remove section limiter

export const removeSectionRateLimiter = createRateLimiter({
    window: RATE_LIMIT.SECTION.DELETE.WINDOW_MS,
    limit: RATE_LIMIT.SECTION.DELETE.LIMIT,
    resource: "section deletion",
});

///////////////////////////////////////////////////////////////
// reorder sections limiter

export const reorderSectionsRateLimiter = createRateLimiter({
    window: RATE_LIMIT.SECTION.REORDER.WINDOW_MS,
    limit: RATE_LIMIT.SECTION.REORDER.LIMIT,
    resource: "section reordering",
});

///////////////////////////////////////////////////////////////
// publish section limiter

export const publishSectionRateLimiter = createRateLimiter({
    window: RATE_LIMIT.SECTION.CHANGE_STATUS.WINDOW_MS,
    limit: RATE_LIMIT.SECTION.CHANGE_STATUS.LIMIT,
    resource: "section publishing",
});

///////////////////////////////////////////////////////////////
// save section as draft limiter

export const saveSectionAsDraftRateLimiter = createRateLimiter({
    window: RATE_LIMIT.SECTION.CHANGE_STATUS.WINDOW_MS,
    limit: RATE_LIMIT.SECTION.CHANGE_STATUS.LIMIT,
    resource: "section draft update",
});

///////////////////////////////////////////////////////////////
// fetch instructor section limiter

export const fetchInstructorSectionRateLimiter = createRateLimiter({
    window: RATE_LIMIT.API.WINDOW_MS,
    limit: RATE_LIMIT.API.LIMIT,
    resource: "section retrieval",
});

///////////////////////////////////////////////////////////////
// fetch instructor sections limiter

export const fetchInstructorSectionsRateLimiter = createRateLimiter({
    window: RATE_LIMIT.API.WINDOW_MS,
    limit: RATE_LIMIT.API.LIMIT,
    resource: "sections retrieval",
});
