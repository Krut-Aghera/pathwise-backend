import ApiError from "../../utils/error-handler.utility.js";

import * as lectureRepository from "./lecture.repository.js";

import { LECTURE_ERROR_MESSAGES } from "./lecture.constants.js";
import HTTP_STATUS from "../../constants/http.constants.js";

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

///////////////////////////////////////////////////////////////
// check if section has a published lecture

const hasPublishedLecture = async ({ sectionId }) => {
    return Boolean(
        await lectureRepository.existsPublishedLectureBySection({
            sectionId,
        })
    );
};

//////////////////////////////////////////////////////////////
// get published student lecture

const getPublishedStudentLecture = async ({ lectureId }) => {
    const lecture = await lectureRepository.findPublishedLecture({
        lectureId,
    });

    if (!lecture || !lecture.section || !lecture.section.course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: LECTURE_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    return lecture;
};

///////////////////////////////////////////////////////////////
// validate lecture reorder payload

const validateLectureReorderPayload = ({ lectures }) => {
    const lectureIds = new Set();
    const orders = new Set();

    for (const { lectureId, order } of lectures) {
        if (lectureIds.has(lectureId)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: LECTURE_ERROR_MESSAGES.DUPLICATE_LECTURE_IDS,
            });
        }

        if (orders.has(order)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: LECTURE_ERROR_MESSAGES.DUPLICATE_LECTURE_ORDERS,
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
                message:
                    LECTURE_ERROR_MESSAGES.LECTURE_ORDERS_MUST_BE_SEQUENTIAL,
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
            message: LECTURE_ERROR_MESSAGES.INVALID_LECTURE_REORDER_PAYLOAD,
        });
    }

    const sectionLectureIds = new Set(
        sectionLectures.map((lecture) => lecture._id.toString())
    );

    for (const { lectureId } of lectures) {
        if (!sectionLectureIds.has(lectureId)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: LECTURE_ERROR_MESSAGES.INVALID_LECTURE_REORDER_PAYLOAD,
            });
        }
    }
};

//////////////////////////////////////////////////////////////
// exports

export {
    getAuthorizedInstructorLecture,
    hasPublishedLecture,
    getPublishedStudentLecture,
    validateLectureReorderPayload,
    validateSectionLectureReorder,
};
