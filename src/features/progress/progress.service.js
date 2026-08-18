import * as progressRepository from "./progress.repository.js";
import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { PROGRESS_ERROR_MESSAGES } from "./progress.constants.js";

////////////////////////////////////////////////////////////////
// fetch course progress service

const fetchCourseProgress = async ({ studentId, courseId }) => {
    const existingCourseProgress =
        await progressRepository.findProgressByStudentAndCourse({
            studentId,
            courseId,
        });

    if (existingCourseProgress) {
        return existingCourseProgress;
    }

    return progressRepository.createProgress({
        studentId,
        courseId,
    });
};

///////////////////////////////////////////////////////////////
// initialize lecture progress service

const initializeLectureProgress = async ({
    studentId,
    courseId,
    lectureId,
}) => {
    const progress = await progressRepository.findProgressByStudentAndCourse({
        studentId,
        courseId,
    });

    if (!progress) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PROGRESS_ERROR_MESSAGES.PROGRESS_NOT_FOUND,
        });
    }

    const existingLectureProgress = progress.lectures.find(
        ({ lecture }) => lecture.toString() === lectureId.toString()
    );

    if (existingLectureProgress) {
        return progress;
    }

    const lectureProgress = {
        lecture: lectureId,
        lastPosition: 0,
        watchedDuration: 0,
        isCompleted: false,
        lastAccessedAt: new Date(),
        completedAt: null,
    };

    return progressRepository.initializeLectureProgress({
        progressId: progress._id,
        lectureProgress,
    });
};

///////////////////////////////////////////////////////////////
// update lecture progress service

const updateLectureProgress = async ({
    studentId,
    courseId,
    lectureId,
    lastPosition,
    watchedDuration,
}) => {};

//////////////////////////////////////////////////////////////
// complete lecture service

const completeLecture = async ({ studentId, courseId, lectureId }) => {};

//////////////////////////////////////////////////////////////
// exports

export {
    fetchCourseProgress,
    initializeLectureProgress,
    updateLectureProgress,
    completeLecture,
};
