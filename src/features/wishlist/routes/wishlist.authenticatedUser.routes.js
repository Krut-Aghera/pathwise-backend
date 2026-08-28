import express from "express";
import * as wishlistControllers from "../wishlist.controllers.js";
import * as wishlistRatelimiter from "../../../middlewares/ratelimiter/limiters/wishlist.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import { userAuthEngine } from "../../../middlewares/auth/auth.middleware.engines.js";

///////////////////////////////////////////////////////////////
// create router

const wishlistAuthenticatedUser = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/wishlist/:courseId
// Adds the specified course to the authenticated student's wishlist.

wishlistAuthenticatedUser.post(
    "/:courseId",
    wishlistRatelimiter.addCourseToWishlistRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    wishlistControllers.addCourseToWishlist
);

///////////////////////////////////////////////////////////////
// DELETE /api/v1/wishlist//courses/:courseId
// Removes the specified course from the authenticated student's wishlist.

wishlistAuthenticatedUser.delete(
    "/courses/:courseId",
    wishlistRatelimiter.removeCourseFromWishlistRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "courseId",
        fieldName: "Course ID",
    }),
    validationEngine,
    wishlistControllers.removeCourseFromWishlist
);

///////////////////////////////////////////////////////////////
// GET /api/v1/wishlist
// Fetches the authenticated student's wishlist.

wishlistAuthenticatedUser.get(
    "/",
    wishlistRatelimiter.fetchWishlistRateLimiter,
    ...userAuthEngine,
    validationEngine,
    wishlistControllers.fetchWishlist
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/wishlist
// Clears the authenticated student's wishlist.

wishlistAuthenticatedUser.patch(
    "/",
    wishlistRatelimiter.clearWishlistRateLimiter,
    ...userAuthEngine,
    validationEngine,
    wishlistControllers.clearWishlist
);

///////////////////////////////////////////////////////////////
// export

export default wishlistAuthenticatedUser;
