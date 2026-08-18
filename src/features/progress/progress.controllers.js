import * as progressService from "./progress.service.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiResponse from "../../utils/response-handler.utility.js";
import { PROGRESS_SUCCESS_MESSAGES } from "./progress.constants.js";

///////////////////////////////////////////////////////////////
// fetch course progress controller

const fetchCourseProgress = async (req, res) => {
    const progress = await progressService.fetchCourseProgress({
        studentId: req.user._id,
        courseId: req.params.courseId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: PROGRESS_SUCCESS_MESSAGES.FETCHED,
            data: progress,
        })
    );
};

////////////////////////////////////////////////////////////////
// initialize lecture progress controller

const initializeLectureProgress = async (req, res) => {
    const progress = await progressService.initializeLectureProgress({
        studentId: req.user._id,
        courseId: req.params.courseId,
        lectureId: req.params.lectureId,
    });

    return res.status(HTTP_STATUS.OK).json({
        statusCode: HTTP_STATUS.OK,
        message: PROGRESS_SUCCESS_MESSAGES.INITIALIZED,
        data: progress,
    });
};

//////////////////////////////////////////////////////////////
// update lecture progress controller

const updateLectureProgress = async (req, res) => {};

//////////////////////////////////////////////////////////////
// complete lecture controller

const completeLecture = async (req, res) => {};

//////////////////////////////////////////////////////////////
// exports

export {
    fetchCourseProgress,
    initializeLectureProgress,
    updateLectureProgress,
    completeLecture,
};
