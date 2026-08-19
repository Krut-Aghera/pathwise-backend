import * as progressService from "./progress.service.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiResponse from "../../utils/response-handler.utility.js";
import {
    LECTURE_PROGRESS_UPDATE_FIELDS,
    PROGRESS_SUCCESS_MESSAGES,
} from "./progress.constants.js";

///////////////////////////////////////////////////////////////
// fetch course progress controller

const fetchCourseProgress = async (req, res) => {
    const { progress, meta } = await progressService.fetchCourseProgress({
        studentId: req.user._id,
        courseId: req.params.courseId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: PROGRESS_SUCCESS_MESSAGES.FETCHED,
            data: progress,
            meta,
        })
    );
};

////////////////////////////////////////////////////////////////
// initialize lecture progress controller

const initializeLectureProgress = async (req, res) => {
    const { progress, meta } = await progressService.initializeLectureProgress({
        studentId: req.user._id,
        courseId: req.params.courseId,
        lectureId: req.params.lectureId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: PROGRESS_SUCCESS_MESSAGES.INITIALIZED,
            data: progress,
            meta,
        })
    );
};

//////////////////////////////////////////////////////////////
// update lecture progress controller

const updateLectureProgress = async (req, res) => {
    const progressData = LECTURE_PROGRESS_UPDATE_FIELDS.reduce((acc, key) => {
        if (req.body[key] !== undefined) {
            acc[key] = req.body[key];
        }
        return acc;
    }, {});

    const { progress, meta } = await progressService.updateLectureProgress({
        studentId: req.user._id,
        courseId: req.params.courseId,
        lectureId: req.params.lectureId,
        progressData,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: PROGRESS_SUCCESS_MESSAGES.UPDATED,
            data: progress,
            meta,
        })
    );
};

//////////////////////////////////////////////////////////////
// update lecture completion progress controller

const updateLectureCompletionProgress = async (req, res) => {
    const { progress, meta } =
        await progressService.updateLectureCompletionProgress({
            studentId: req.user._id,
            courseId: req.params.courseId,
            lectureId: req.params.lectureId,
        });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: PROGRESS_SUCCESS_MESSAGES.COMPLETED,
            data: progress,
            meta,
        })
    );
};

//////////////////////////////////////////////////////////////
// exports

export {
    fetchCourseProgress,
    initializeLectureProgress,
    updateLectureProgress,
    updateLectureCompletionProgress,
};
