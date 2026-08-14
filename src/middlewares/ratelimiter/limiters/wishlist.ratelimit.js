import { WISHLIST_RT } from "../ratelimit.constants.js";
import createRateLimiter from "../ratelimit.utility.js";

///////////////////////////////////////////////////////////////
// add course to wishlist limiter

export const addCourseToWishlistRateLimiter = createRateLimiter({
    window: WISHLIST_RT.ADD.WINDOW_MS,
    limit: WISHLIST_RT.ADD.LIMIT,
    resource: "course wishlist addition",
});

///////////////////////////////////////////////////////////////
// remove course from wishlist limiter

export const removeCourseFromWishlistRateLimiter = createRateLimiter({
    window: WISHLIST_RT.REMOVE.WINDOW_MS,
    limit: WISHLIST_RT.REMOVE.LIMIT,
    resource: "course wishlist removal",
});

///////////////////////////////////////////////////////////////
// fetch wishlist limiter

export const fetchWishlistRateLimiter = createRateLimiter({
    window: WISHLIST_RT.FETCH.WINDOW_MS,
    limit: WISHLIST_RT.FETCH.LIMIT,
    resource: "wishlist fetch",
});

///////////////////////////////////////////////////////////////
// clear wishlist limiter

export const clearWishlistRateLimiter = createRateLimiter({
    window: WISHLIST_RT.CLEAR.WINDOW_MS,
    limit: WISHLIST_RT.CLEAR.LIMIT,
    resource: "wishlist clearing",
});
