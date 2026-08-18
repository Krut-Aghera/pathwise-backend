import * as progressRepository from "./progress.repository.js"
import ApiError from "../../utils/error-handler.utility.js";

////////////////////////////////////////////////////////////////
// fetch course progress service

const fetchCourseProgress = async ({
    studentId,
    courseId,
}) => {
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

const initializeLectureProgress = async ({ studentId, courseId, lectureId, }) => { };

///////////////////////////////////////////////////////////////
// update lecture progress service

const updateLectureProgress = async ({ studentId, courseId, lectureId, lastPosition, watchedDuration, }) => { };

//////////////////////////////////////////////////////////////
// complete lecture service

const completeLecture = async ({ studentId, courseId, lectureId, }) => { };

//////////////////////////////////////////////////////////////
// exports

export {
    fetchCourseProgress,
    initializeLectureProgress,
    updateLectureProgress,
    completeLecture,
};