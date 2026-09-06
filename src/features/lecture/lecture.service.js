import ApiError from "../../utils/error-handler.utility.js";
import logger from "../../utils/pino-logger.utility.js";

import {
    getAuthorizedInstructorSection,
    reconcileSectionPublication,
} from "../section/section.utility.js";
import {
    getAuthorizedInstructorLecture,
    getPublishedStudentLecture,
    validateLectureReorderPayload,
    validateSectionLectureReorder,
} from "./lecture.utility.js";

import * as mediaService from "../../services/media/media.services.js";

import * as lectureRepository from "./lecture.repository.js";
import * as enrollmentRepository from "../enrollment/enrollment.repository.js";

import { LECTURE_ERROR_MESSAGES } from "./lecture.constants.js";
import { ENROLLMENT_ERROR_MESSAGES } from "../enrollment/enrollment.constants.js";

import {
    CLOUDINARY_FOLDERS,
    MEDIA_RESOURCE_TYPES,
} from "../../services/media/media.constants.js";

import { RESOURCE_STATUS } from "../../constants/resource.constants.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { reconcileCoursePublication } from "../course/course.utility.js";

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

    await lectureRepository.removeLecture({
        lectureId,
    });

    const updatedSection = await reconcileSectionPublication({
        sectionId: lecture.section._id,
    });

    if (updatedSection) {
        await reconcileCoursePublication({
            courseId: lecture.section.course._id,
        });
    }
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
        uploadedVideo = await mediaService.uploadVideoMedia({
            localFilePath: video.path,
            folder: CLOUDINARY_FOLDERS.LECTURE_VIDEOS,
        });

        const thumbnailUrl = mediaService.generateVideoThumbnailUrl({
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
                await mediaService.destroyMedia({
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

    await mediaService.destroyMedia({
        publicId: lecture.video.publicId,
        resourceType: MEDIA_RESOURCE_TYPES.VIDEO,
    });

    const updatedLecture = await lectureRepository.removeLectureVideoAndDraft({
        lectureId,
    });

    const updatedSection = await reconcileSectionPublication({
        sectionId: lecture.section._id,
    });

    if (updatedSection) {
        await reconcileCoursePublication({
            courseId: lecture.section.course._id,
        });
    }

    logger.info("Lecture video removed successfully.", {
        lectureId: lecture._id,
        instructorId,
    });

    return updatedLecture;
};

///////////////////////////////////////////////////////////////
// publish lecture service

const publishLecture = async ({ instructorId, lectureId }) => {
    const lecture = await getAuthorizedInstructorLecture({
        instructorId,
        lectureId,
    });

    if (lecture.status !== RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: LECTURE_ERROR_MESSAGES.LECTURE_NOT_DRAFT,
        });
    }

    if (
        !lecture.video?.url ||
        !lecture.video?.publicId ||
        !lecture.video?.duration
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: LECTURE_ERROR_MESSAGES.LECTURE_NOT_ELIGIBLE_FOR_PUBLISH,
        });
    }

    return lectureRepository.updateLectureStatus({
        lectureId,
        currentStatus: RESOURCE_STATUS.DRAFT,
        nextStatus: RESOURCE_STATUS.PUBLISHED,
    });
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
            message: LECTURE_ERROR_MESSAGES.LECTURE_ALREADY_DRAFT,
        });
    }

    const updatedLecture = await lectureRepository.updateLectureStatus({
        lectureId,
        currentStatus: RESOURCE_STATUS.PUBLISHED,
        nextStatus: RESOURCE_STATUS.DRAFT,
    });

    const updatedSection = await reconcileSectionPublication({
        sectionId: lecture.section._id,
    });

    if (updatedSection) {
        await reconcileCoursePublication({
            courseId: lecture.section.course._id,
        });
    }

    return updatedLecture;
};

///////////////////////////////////////////////////////////////
// fetch instructor lecture service

const fetchInstructorLecture = async ({ instructorId, lectureId }) => {
    return getAuthorizedInstructorLecture({ instructorId, lectureId });
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
