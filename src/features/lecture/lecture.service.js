import * as lectureRepository from "./lecture.repository.js";
import * as enrollmentRepository from "../enrollment/enrollment.repository.js";
import { getAuthorizedInstructorSection } from "../section/section.utility.js";
import {
    getAuthorizedInstructorLecture,
    getPublishedStudentLecture,
    validateLectureReorderPayload,
    validateSectionLectureReorder,
} from "./lecture.utility.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import logger from "../../utils/pino-logger.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { LECTURE_ERROR_MESSAGES } from "./lecture.constants.js";
import {
    destroyMedia,
    generateVideoThumbnailUrl,
    uploadVideoMedia,
} from "../../services/media/media.services.js";
import {
    CLOUDINARY_FOLDERS,
    MEDIA_RESOURCE_TYPES,
} from "../../services/media/media.constants.js";
import { ENROLLMENT_ERROR_MESSAGES } from "../enrollment/enrollment.constants.js";

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

const reorderLectures = async ({ sectionId, instructorId, lectures }) => {
    await getAuthorizedInstructorSection({ sectionId, instructorId });

    validateLectureReorderPayload({ lectures });

    const sectionLectures = await lectureRepository.findSectionLectureIds({
        sectionId,
    });

    validateSectionLectureReorder({
        lectures,
        sectionLectures,
    });

    await lectureRepository.reorderLectures({ lectures });
};

///////////////////////////////////////////////////////////////
// upload lecture video service

const uploadLectureVideo = async ({ instructorId, lectureId, video }) => {
    if (!video) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: LECTURE_ERROR_MESSAGES.VIDEO_REQUIRED,
        });
    }

    const lecture = await getAuthorizedInstructorLecture({
        lectureId,
        instructorId,
    });

    if (lecture.video?.publicId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: LECTURE_ERROR_MESSAGES.VIDEO_ALREADY_EXISTS,
        });
    }

    let uploadedVideo;

    try {
        uploadedVideo = await uploadVideoMedia({
            localFilePath: video.path,
            folder: CLOUDINARY_FOLDERS.LECTURE_VIDEOS,
        });

        const thumbnailUrl = generateVideoThumbnailUrl({
            publicId: uploadedVideo.publicId,
        });

        lecture.video = {
            url: uploadedVideo.url,
            publicId: uploadedVideo.publicId,
            duration: uploadedVideo.duration,
            thumbnailUrl,
        };

        await lectureRepository.saveLecture({ lecture });

        logger.info("Lecture video uploaded successfully.", {
            lectureId: lecture._id,
            instructorId,
            publicId: uploadedVideo.publicId,
        });

        return lecture;
    } catch (error) {
        if (uploadedVideo?.publicId) {
            try {
                await destroyMedia({
                    publicId: uploadedVideo.publicId,
                    resourceType: MEDIA_RESOURCE_TYPES.VIDEO,
                });
            } catch (destroyError) {
                logger.error(
                    "Failed to rollback uploaded lecture video from Cloudinary.",
                    {
                        lectureId,
                        publicId: uploadedVideo.publicId,
                        rollbackError: destroyError.message,
                        originalError: error.message,
                    }
                );
            }
        }

        throw error;
    }
};

///////////////////////////////////////////////////////////////
// remove lecture video service

const removeLectureVideo = async ({ instructorId, lectureId }) => {
    const lecture = await getAuthorizedInstructorLecture({
        lectureId,
        instructorId,
    });

    if (!lecture.video?.publicId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: LECTURE_ERROR_MESSAGES.VIDEO_NOT_FOUND,
        });
    }

    await destroyMedia({
        publicId: lecture.video.publicId,
        resourceType: MEDIA_RESOURCE_TYPES.VIDEO,
    });

    lecture.video = null;

    lecture.status = RESOURCE_STATUS.DRAFT;

    await lectureRepository.saveLecture({ lecture });

    logger.info("Lecture video removed successfully.", {
        lectureId: lecture._id,
        instructorId,
    });

    return lecture;
};

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

const fetchInstructorLecture = async ({ instructorId, lectureId }) => {
    return await getAuthorizedInstructorLecture({ instructorId, lectureId });
};

///////////////////////////////////////////////////////////////
// fetch instructor lectures service

const fetchSectionLectures = async ({ instructorId, sectionId }) => {
    await getAuthorizedInstructorSection({ instructorId, sectionId });

    return lectureRepository.findSectionLectures({ sectionId });
};

///////////////////////////////////////////////////////////////
// fetch student lectures service

const fetchStudentLecture = async ({ lectureId, studentId }) => {
    const lecture = await getPublishedStudentLecture({ lectureId });

    const enrollment = await enrollmentRepository.findEnrollment({
        studentId,
        courseId: lecture.section.course._id,
    });

    if (!enrollment) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: ENROLLMENT_ERROR_MESSAGES.NOT_ENROLLED,
        });
    }

    return lecture;
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
