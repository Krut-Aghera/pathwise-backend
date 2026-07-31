import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import { LECTURE_ERROR_MESSAGES } from "./lecture.constants.js";
import * as lectureRepository from "./lecture.repository.js";

//////////////////////////////////////////////////////////////
// get authorized instructor lecture

const getAuthorizedInstructorLecture = async ({
    lectureId,
    instructorId,
    includeCourse = false,
    includeSection = false,
}) => {
    const lecture = await lectureRepository.findInstructorLecture({
        lectureId,
        instructorId,
    });

    if (!lecture || !lecture.section || !lecture.section.course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: LECTURE_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    if (!includeCourse) {
        lecture.section.course = undefined;
    }

    if (!includeSection) {
        lecture.section = undefined;
    }

    return lecture;
};

//////////////////////////////////////////////////////////////
// exports

export { getAuthorizedInstructorLecture };
