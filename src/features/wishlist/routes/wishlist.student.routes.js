import express from "express";
import * as wishlistControllers from "../wishlist.controllers.js";
import * as wishlistRatelimiter from "../../../middlewares/ratelimiter/limiters/wishlist.ratelimit.js";
import studentAuthMiddleware from "../../../middlewares/auth/student-auth.middleware.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import { validateMongoIdParam } from "../../../validations/common.validators.js";

///////////////////////////////////////////////////////////////
// create router

const wishlistStudentRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/wishlist/:courseId
// Adds the specified course to the authenticated student's wishlist.

wishlistStudentRouter.post(
    "/:courseId",
    wishlistRatelimiter.addCourseToWishlistRateLimiter,
    ...studentAuthMiddleware,
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

wishlistStudentRouter.delete(
    "/courses/:courseId",
    wishlistRatelimiter.removeCourseFromWishlistRateLimiter,
    ...studentAuthMiddleware,
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

wishlistStudentRouter.get(
    "/",
    wishlistRatelimiter.fetchWishlistRateLimiter,
    ...studentAuthMiddleware,
    validationEngine,
    wishlistControllers.fetchWishlist
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/wishlist
// Clears the authenticated student's wishlist.

wishlistStudentRouter.patch(
    "/",
    wishlistRatelimiter.clearWishlistRateLimiter,
    ...studentAuthMiddleware,
    validationEngine,
    wishlistControllers.clearWishlist
);

///////////////////////////////////////////////////////////////
// export

export default wishlistStudentRouter;
