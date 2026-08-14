import * as wishlistRepository from "./wishlist.repository.js";
import * as courseRepository from "../course/course.repository.js";

import ApiError from "../../utils/error-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { WISHLIST_ERROR_MESSAGES } from "./wishlist.constants.js";
import { COURSE_ERROR_MESSAGES } from "../course/course.constants.js";

///////////////////////////////////////////////////////////////
// add course to wishlist service

const addCourseToWishlist = async ({ studentId, courseId }) => {
    const course = await courseRepository.findPublishedCourse({
        courseId,
    });

    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: COURSE_ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
    }

    return wishlistRepository.addCourseToWishlist({
        studentId,
        courseId,
    });
};

///////////////////////////////////////////////////////////////
// remove course from wishlist service

const removeCourseFromWishlist = async ({ studentId, courseId }) => {
    const wishlist = await wishlistRepository.removeCourseFromWishlist({
        studentId,
        courseId,
    });

    if (!wishlist) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: WISHLIST_ERROR_MESSAGES.WISHLIST_NOT_FOUND,
        });
    }

    return wishlist;
};

///////////////////////////////////////////////////////////////
// fetch wishlist service

const fetchWishlist = async ({ studentId }) => {
    const wishlist = await wishlistRepository.findWishlistByStudent({
        studentId,
    });

    if (!wishlist) {
        return {
            student: studentId,
            courses: [],
        };
    }

    return wishlist;
};

///////////////////////////////////////////////////////////////
// clear wishlist service

const clearWishlist = async ({ studentId }) => {
    const wishlist = await wishlistRepository.clearWishlist({
        studentId,
    });

    if (!wishlist) {
        return {
            student: studentId,
            courses: [],
        };
    }

    return wishlist;
};

///////////////////////////////////////////////////////////////
// exports

export {
    addCourseToWishlist,
    removeCourseFromWishlist,
    fetchWishlist,
    clearWishlist,
};
