import * as lectureRepository from "./lecture.repository.js";
import { getAuthorizedInstructorSection } from "../section/section.utility";
import { getAuthorizedInstructorLecture } from "./lecture.utility.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { LECTURE_ERROR_MESSAGES } from "./lecture.constants.js";

///////////////////////////////////////////////////////////////
// create lecture service

const createLecture = async ({ instructorId, sectionId, lectureData }) => {
    await getAuthorizedInstructorSection({
        instructorId,
        sectionId,
    });

    const lastOrder = await lectureRepository.findLastLectureOrder({
        sectionId,
    });

    const order = lastOrder ? lastOrder.order + 1 : 1;

    const lecturePayload = {
        section: sectionId,
        ...lectureData,
        order,
    };

    return lectureRepository.createLecture({ lecturePayload });
};

///////////////////////////////////////////////////////////////
// update lecture service

const updateLecture = async ({ instructorId, lectureId, lectureData }) => {
    const lecture = await getAuthorizedInstructorLecture({
        lectureId,
        instructorId,
        includeSection: true,
    });

    Object.assign(lecture, lectureData);

    return lectureRepository.saveLecture({
        lecture,
        validateBeforeSave: true,
    });
};

///////////////////////////////////////////////////////////////
// remove lecture service

const removeLecture = async ({ instructorId, lectureId }) => {
    const lecture = await getAuthorizedInstructorLecture({
        lectureId,
        instructorId,
    });

    lecture.isDeleted = true;

    return lectureRepository.saveLecture({
        lecture,
    });
};

///////////////////////////////////////////////////////////////
// reorder lectures service

const reorderLectures = async ({}) => {};

///////////////////////////////////////////////////////////////
// update lecture video service

const updateLectureVideo = async ({}) => {};

///////////////////////////////////////////////////////////////
// remove lecture video service

const removeLectureVideo = async ({}) => {};

///////////////////////////////////////////////////////////////
// publish lecture service

const publishLecture = async ({ instructorId, lectureId }) => {
    const lecture = await getAuthorizedInstructorLecture({
        instructorId,
        lectureId,
    });

    if (
        !lecture.video?.url ||
        !lecture.video?.publicId ||
        !lecture.video?.duration
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: LECTURE_ERROR_MESSAGES.VIDEO_REQUIRED_TO_PUBLISH,
        });
    }

    if (lecture.status !== RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: LECTURE_ERROR_MESSAGES.CAN_NOT_PUBLISH,
        });
    }

    lecture.status = RESOURCE_STATUS.PUBLISHED;

    return lectureRepository.saveLecture({ lecture });
};

///////////////////////////////////////////////////////////////
// save lecture as draft service

const saveLectureAsDraft = async ({ instructorId, lectureId }) => {
    const lecture = await getAuthorizedInstructorLecture({
        instructorId,
        lectureId,
    });

    if (lecture.status === RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: LECTURE_ERROR_MESSAGES.CAN_NOT_SAVE_AS_DRAFT,
        });
    }

    lecture.status = RESOURCE_STATUS.DRAFT;

    return lectureRepository.saveLecture({ lecture });
};

///////////////////////////////////////////////////////////////
// fetch instructor lecture service

const fetchInstructorLecture = async ({}) => {};

///////////////////////////////////////////////////////////////
// fetch instructor lectures service

const fetchSectionLectures = async ({}) => {};

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
