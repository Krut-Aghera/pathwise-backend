import mongoose from "mongoose";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import { LECTURE_ERROR_MESSAGES } from "./lecture.constants.js";
import Lecture from "./lecture.model.js";
import * as lectureRepository from "./lecture.repository.js";

//////////////////////////////////////////////////////////////
// get authorized instructor lecture

const getAuthorizedInstructorLecture = async ({ lectureId, instructorId }) => {
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

    return lecture;
};

//////////////////////////////////////////////////////////////
// get published student lecture

const getPublishedStudentLecture = async ({ lectureId }) => {
    const lecture = await lectureRepository.findPublishedLecture({
        lectureId
    });

    if (!lecture || !lecture.section || !lecture.section.course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: LECTURE_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    return lecture;
}

///////////////////////////////////////////////////////////////
// validate lecture reorder payload

const validateLectureReorderPayload = ({ lectures }) => {
    const lectureIds = new Set();
    const orders = new Set();

    for (const { lectureId, order } of lectures) {
        if (lectureIds.has(lectureId)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Duplicate lecture IDs are not allowed.",
            });
        }

        if (orders.has(order)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Duplicate lecture orders are not allowed.",
            });
        }

        lectureIds.add(lectureId);
        orders.add(order);
    }

    const sortedOrders = [...orders].sort((a, b) => a - b);

    for (let index = 0; index < sortedOrders.length; index++) {
        const expectedOrder = index + 1;

        if (sortedOrders[index] !== expectedOrder) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Lecture orders must start from 1 and be sequential.",
            });
        }
    }
};

///////////////////////////////////////////////////////////////
// validate section lecture reorder

const validateSectionLectureReorder = ({ lectures, sectionLectures }) => {
    if (lectures.length !== sectionLectures.length) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Invalid lecture reorder payload.",
        });
    }

    const sectionLectureIds = new Set(
        sectionLectures.map((lecture) => lecture._id.toString())
    );

    for (const { lectureId } of lectures) {
        if (!sectionLectureIds.has(lectureId)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Invalid lecture reorder payload.",
            });
        }
    }
};

//////////////////////////////////////////////////////////////
// exports

export {
    getAuthorizedInstructorLecture,
    getPublishedStudentLecture,
    validateLectureReorderPayload,
    validateSectionLectureReorder,
};
