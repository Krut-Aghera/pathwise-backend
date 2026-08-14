import * as wishlistService from "./wishlist.service.js";
import ApiResponse from "../../utils/response-handler.utility.js";
import { WISHLIST_SUCCESS_MESSAGES } from "./wishlist.constants.js";
import HTTP_STATUS from "../../constants/http.constants.js";

///////////////////////////////////////////////////////////////
// add course to wishlist controller

const addCourseToWishlist = async (req, res) => {
    const wishlist = await wishlistService.addCourseToWishlist({
        studentId: req.user._id,
        courseId: req.params.courseId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: WISHLIST_SUCCESS_MESSAGES.ADDED,
            data: wishlist,
        })
    );
};

///////////////////////////////////////////////////////////////
// remove course from wishlist controller

const removeCourseFromWishlist = async (req, res) => {
    const wishlist = await wishlistService.removeCourseFromWishlist({
        studentId: req.user._id,
        courseId: req.params.courseId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: WISHLIST_SUCCESS_MESSAGES.REMOVED,
            data: wishlist,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch wishlist controller

const fetchWishlist = async (req, res) => {
    const wishlist = await wishlistService.fetchWishlist({
        studentId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: WISHLIST_SUCCESS_MESSAGES.FETCHED,
            data: wishlist,
        })
    );
};

///////////////////////////////////////////////////////////////
// clear wishlist controller

const clearWishlist = async (req, res) => {
    const wishlist = await wishlistService.clearWishlist({
        studentId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: WISHLIST_SUCCESS_MESSAGES.CLEARED,
            data: wishlist,
        })
    );
};

///////////////////////////////////////////////////////////////
// exports

export {
    addCourseToWishlist,
    removeCourseFromWishlist,
    fetchWishlist,
    clearWishlist,
};
