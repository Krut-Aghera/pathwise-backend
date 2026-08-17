import ApiError from "../../utils/error-handler.utility.js";
import ApiResponse from "../../utils/response-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import {
    COURSE_ALLOWED_FIELDS,
    COURSE_ERROR_MESSAGES,
    COURSE_FETCH_QUERY_FIELDS,
    COURSE_SUCCESS_MESSAGES,
} from "./course.constants.js";

import * as courseService from "./course.service.js";
///////////////////////////////////////////////////////////////
// create course controller

const createCourse = async (req, res) => {
    const courseData = COURSE_ALLOWED_FIELDS.reduce((acc, key) => {
        acc[key] = req.body[key];
        return acc;
    }, {});

    const courseThumbnailTempPath = req.file?.path;

    if (!courseThumbnailTempPath) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: COURSE_ERROR_MESSAGES.THUMBNAIL_REQUIRED,
        });
    }

    const course = await courseService.createCourse({
        instructorId: req.user._id,
        courseData,
        courseThumbnailTempPath,
    });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.CREATED,
            message: COURSE_SUCCESS_MESSAGES.COURSE_CREATED,
            data: course,
        })
    );
};

///////////////////////////////////////////////////////////////
// update course controller

const updateCourse = async (req, res) => {
    const courseData = COURSE_ALLOWED_FIELDS.reduce((acc, key) => {
        acc[key] = req.body[key];
        return acc;
    }, {});

    const course = await courseService.updateCourse({
        courseId: req.params.courseId,
        instructorId: req.user._id,
        courseData,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.COURSE_UPDATED,
            data: course,
        })
    );
};

///////////////////////////////////////////////////////////////
// update thumbnail controller

const updateThumbnail = async (req, res) => {
    const courseThumbnailTempPath = req.file?.path;

    if (!courseThumbnailTempPath) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: COURSE_ERROR_MESSAGES.THUMBNAIL_REQUIRED,
        });
    }

    const thumbnail = await courseService.updateThumbnail({
        courseId: req.params.courseId,
        instructorId: req.user._id,
        courseThumbnailTempPath,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.COURSE_THUMBNAIL_UPDATED,
            data: thumbnail,
        })
    );
};

///////////////////////////////////////////////////////////////
// remove course controller

const removeCourse = async (req, res) => {
    await courseService.removeCourse({
        courseId: req.params.courseId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.COURSE_DELETED,
        })
    );
};

///////////////////////////////////////////////////////////////
// publish course controller

const publishCourse = async (req, res) => {
    const course = await courseService.publishCourse({
        courseId: req.params.courseId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.COURSE_PUBLISHED,
            data: course,
        })
    );
};

///////////////////////////////////////////////////////////////
// Save course as draft

const saveCourseAsDraft = async (req, res) => {
    const course = await courseService.saveCourseAsDraft({
        courseId: req.params.courseId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.COURSE_SAVED_AS_DRAFT,
            data: course,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch instructor current course controller

const fetchInstructorCourse = async (req, res) => {
    const course = await courseService.fetchInstructorCourse({
        courseId: req.params.courseId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.INSTRUCTOR_COURSE_FETCHED,
            data: course,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch Instructor courses controller

const fetchInstructorCourses = async (req, res) => {
    const { page, limit } = req.query;

    const { courses, metadata } = await courseService.fetchInstructorCourses({
        instructorId: req.user._id,
        page,
        limit,
    });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.INSTRUCTOR_COURSES_FETCHED,
            data: courses,
            meta: metadata,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch courses controller

const fetchCourses = async (req, res) => {
    const queryData = COURSE_FETCH_QUERY_FIELDS.reduce((acc, key) => {
        if (req.query[key] !== undefined) {
            acc[key] = req.query[key];
        }

        return acc;
    }, {});

    const { courses, metadata } = await courseService.fetchCourses({
        queryData,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.COURSES_FETCHED,
            data: courses,
            meta: metadata,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch current course controller

const fetchCurrentCourse = async (req, res) => {
    const course = await courseService.fetchCurrentCourse({
        courseId: req.params.courseId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: COURSE_SUCCESS_MESSAGES.COURSE_FETCHED,
            data: course,
        })
    );
};

///////////////////////////////////////////////////////////////
// exports

export {
    createCourse,
    updateCourse,
    updateThumbnail,
    removeCourse,
    publishCourse,
    saveCourseAsDraft,
    fetchInstructorCourse,
    fetchInstructorCourses,
    fetchCourses,
    fetchCurrentCourse,
};
