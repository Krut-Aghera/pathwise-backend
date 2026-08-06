import * as lectureService from "./lecture.service.js";
import {
    LECTURE_ALLOWED_FIELDS,
    LECTURE_SUCCESS_MESSAGES,
} from "./lecture.constants.js";
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

const reorderLectures = async (req, res) => {
    await lectureService.reorderLectures({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
        lectures: req.body.lectures,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.REORDERED,
        })
    );
};

///////////////////////////////////////////////////////////////
// upload lecture video controller

const uploadLectureVideo = async (req, res) => {
    const lecture = await lectureService.uploadLectureVideo({
        instructorId: req.user._id,
        lectureId: req.params.lectureId,
        video: req.file,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.VIDEO_UPLOADED,
            data: lecture,
        })
    );
};

///////////////////////////////////////////////////////////////
// remove lecture video controller

const removeLectureVideo = async (req, res) => {
    const lecture = await lectureService.removeLectureVideo({
        instructorId: req.user._id,
        lectureId: req.params.lectureId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.VIDEO_REMOVED,
            data: lecture,
        })
    );
};

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

const fetchInstructorLecture = async (req, res) => {
    const lecture = await lectureService.fetchInstructorLecture({
        instructorId: req.user._id,
        lectureId: req.params.lectureId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.FETCHED,
            data: lecture,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch section lectures controller

const fetchSectionLectures = async (req, res) => {
    const lectures = await lectureService.fetchSectionLectures({
        instructorId: req.user._id,
        sectionId: req.params.sectionId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.FETCHED_ALL,
            data: lectures,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch student lectures controller

const fetchStudentLecture = async (req, res) => {
    const lecture = await lectureService.fetchStudentLecture({
        lectureId: req.params.lectureId,
        studentId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: LECTURE_SUCCESS_MESSAGES.FETCHED,
            data: lecture,
        })
    );
};

export {
    createLecture,
    updateLecture,
    removeLecture,
    reorderLectures,
    uploadLectureVideo,
    removeLectureVideo,
    publishLecture,
    saveLectureAsDraft,
    fetchInstructorLecture,
    fetchSectionLectures,
    fetchStudentLecture,
};
