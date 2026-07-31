import * as lectureService from "./lecture.service.js";
import {
    LECTURE_ALLOWED_FIELDS,
    LECTURE_SUCCESS_MESSAGES,
} from "./lecture.constants";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiResponse from "../../utils/response-handler.utility.js";

///////////////////////////////////////////////////////////////
// create lecture controller

const createLecture = async (req, res) => {
    const lectureData = LECTURE_ALLOWED_FIELDS.reduce((acc, key) => {
        if (req.body[key] !== undefined) {
            acc[key] = req.body[key];
        }

        return acc;
    }, {});

    const lecture = await lectureService.createLecture({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
        lectureData,
    });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.CREATED,
            message: LECTURE_SUCCESS_MESSAGES.CREATED,
            data: lecture,
        })
    );
};

///////////////////////////////////////////////////////////////
// update lecture controller

const updateLecture = async (req, res) => {
    const lectureData = LECTURE_ALLOWED_FIELDS.reduce((acc, key) => {
        if (req.body[key] !== undefined) {
            acc[key] = req.body[key];
        }

        return acc;
    }, {});

    const lecture = await lectureService.updateLecture({
        instructorId: req.user._id,
        lectureId: req.params.lectureId,
        lectureData,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.UPDATED,
            data: lecture,
        })
    );
};

///////////////////////////////////////////////////////////////
// remove lecture controller

const removeLecture = async (req, res) => {
    await lectureService.removeLecture({
        instructorId: req.user._id,
        lectureId: req.params.lectureId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.DELETED,
        })
    );
};

///////////////////////////////////////////////////////////////
// reorder lectures controller

const reorderLectures = async (req, res) => {};

///////////////////////////////////////////////////////////////
// update lecture video controller

const updateLectureVideo = async (req, res) => {};

///////////////////////////////////////////////////////////////
// remove lecture video controller

const removeLectureVideo = async (req, res) => {};

///////////////////////////////////////////////////////////////
// publish lecture controller

const publishLecture = async (req, res) => {
    const lecture = await lectureService.publishLecture({
        instructorId: req.user._id,
        lectureId: req.params.lectureId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.PUBLISHED,
            data: lecture,
        })
    );
};

///////////////////////////////////////////////////////////////
// save lecture as draft controller

const saveLectureAsDraft = async (req, res) => {
    const lecture = await lectureService.saveLectureAsDraft({
        instructorId: req.user._id,
        lectureId: req.params.lectureId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.SAVED_AS_DRAFT,
            data: lecture,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch instructor lecture controller

const fetchInstructorLecture = async (req, res) => {};

///////////////////////////////////////////////////////////////
// fetch instructor section lectures controller

const fetchSectionLectures = async (req, res) => {};

export {
    createLecture,
    updateLecture,
    removeLecture,
    reorderLectures,
    updateLectureVideo,
    removeLectureVideo,
    publishLecture,
    saveLectureAsDraft,
    fetchInstructorLecture,
    fetchSectionLectures,
};
