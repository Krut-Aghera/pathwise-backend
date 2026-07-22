import HTTP_STATUS from "../../constants/http-status.js";
import {
    CLOUDINARY_FOLDERS,
    MEDIA_RESOURCE_TYPES,
} from "../../services/media/media.constants.js";
import {
    destroyMedia,
    uploadImageMedia,
} from "../../services/media/media.services.js";
import ApiError from "../../utils/errorHandler.js";
import generateSlug from "../../utils/slugGenerator.js";
import logger from "../../utils/pinoLogger.js";
import * as courseRepository from "./course.repository.js";

///////////////////////////////////////////////////////////////
// create course service

const createCourse = async ({
    instructorId,
    courseData,
    courseThumbnailTempPath,
}) => {
    const slug = generateSlug(courseData.title);

    const existingSlug = await courseRepository.findCourseBySlug(slug);

    if (existingSlug) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: `Course is already exist with ${slug} slug, change title to create course.`,
        });
    }

    let thumbnail = null;

    try {
        thumbnail = await uploadImageMedia({
            localFilePath: courseThumbnailTempPath,
            folder: CLOUDINARY_FOLDERS.COURSE_THUMBNAILS,
        });

        logger.info(
            `Thumbnail uploaded successfully. Public ID: ${thumbnail.publicId}`
        );

        const coursePayload = {
            instructor: instructorId,
            slug,
            thumbnail,
            ...courseData,
        };

        const course = await courseRepository.createCourse(coursePayload);
        logger.info(
            `Course "${course.title}" created by instructor ${instructorId}`
        );

        return course;
    } catch (error) {
        if (thumbnail?.publicId) {
            await destroyMedia({
                publicId: thumbnail.publicId,
                resourceType: MEDIA_RESOURCE_TYPES.IMAGE,
            });

            logger.info(
                `Rolled back Cloudinary thumbnail: ${thumbnail.publicId}`
            );
        }

        throw error;
    }
};

///////////////////////////////////////////////////////////////
// update course service

const updateCourse = async ({ courseId, instructorId, courseData }) => {};

///////////////////////////////////////////////////////////////
// remove course service

const removeCourse = async ({ courseId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// update thumbnail service

const updateThumbnail = async ({
    courseId,
    instructorId,
    courseThumbnailTempPath,
}) => {};

///////////////////////////////////////////////////////////////
// publish course service

const publishCourse = async ({ courseId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// unpublish course service

const unpublishCourse = async ({ courseId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// fetch courses service

const fetchCourses = async ({ page, limit, search, sort, filters }) => {};

///////////////////////////////////////////////////////////////
// fetch current course service

const fetchCurrentCourse = async ({ courseId, userId }) => {};

///////////////////////////////////////////////////////////////
// fetch instructor courses service

const fetchInstructorCourses = async ({
    instructorId,
    page,
    limit,
    search,
    sort,
}) => {};

///////////////////////////////////////////////////////////////
// exports

export {
    createCourse,
    updateCourse,
    removeCourse,
    updateThumbnail,
    publishCourse,
    unpublishCourse,
    fetchCourses,
    fetchCurrentCourse,
    fetchInstructorCourses,
};
