import Wishlist from "./wishlist.model.js";
import {
    WISHLIST_COURSE_FIELDS,
    WISHLIST_INSTRUCTOR_FIELDS,
} from "./wishlist.constants.js";

///////////////////////////////////////////////////////////////
// find wishlist by student

const findWishlistByStudent = ({ studentId }) => {
    return Wishlist.findOne({
        student: studentId,
    }).populate({
        path: "courses",
        select: WISHLIST_COURSE_FIELDS,
        populate: {
            path: "instructor",
            select: WISHLIST_INSTRUCTOR_FIELDS,
        },
    });
};

///////////////////////////////////////////////////////////////
// add course to wishlist

const addCourseToWishlist = ({ studentId, courseId }) => {
    return Wishlist.findOneAndUpdate(
        {
            student: studentId,
        },
        [
            {
                $set: {
                    courses: {
                        $concatArrays: [
                            [courseId],
                            {
                                $filter: {
                                    input: "$courses",
                                    as: "course",
                                    cond: {
                                        $ne: ["$$course", courseId],
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        ],
        {
            upsert: true,
            returnDocument: "after",
            updatePipeline: true,
        }
    ).populate({
        path: "courses",
        select: WISHLIST_COURSE_FIELDS,
        populate: {
            path: "instructor",
            select: WISHLIST_INSTRUCTOR_FIELDS,
        },
    });
};

///////////////////////////////////////////////////////////////
// remove course from wishlist

const removeCourseFromWishlist = ({ studentId, courseId }) => {
    return Wishlist.findOneAndUpdate(
        {
            student: studentId,
        },
        {
            $pull: {
                courses: courseId,
            },
        },
        {
            returnDocument: "after",
        }
    ).populate({
        path: "courses",
        select: WISHLIST_COURSE_FIELDS,
        populate: {
            path: "instructor",
            select: WISHLIST_INSTRUCTOR_FIELDS,
        },
    });
};

///////////////////////////////////////////////////////////////
// clear wishlist

const clearWishlist = ({ studentId }) => {
    return Wishlist.findOneAndUpdate(
        {
            student: studentId,
        },
        {
            $set: {
                courses: [],
            },
        },
        {
            returnDocument: "after",
        }
    ).populate({
        path: "courses",
        select: WISHLIST_COURSE_FIELDS,
        populate: {
            path: "instructor",
            select: WISHLIST_INSTRUCTOR_FIELDS,
        },
    });
};

///////////////////////////////////////////////////////////////
// exports

export {
    findWishlistByStudent,
    addCourseToWishlist,
    removeCourseFromWishlist,
    clearWishlist,
};
