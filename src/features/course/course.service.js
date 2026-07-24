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
import { validateCoursePublishEligibility } from "./course.utility.js";

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
}) => {
    const course = await courseRepository.findInstructorCourseById({
        courseId,
        instructorId,
    });

    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "Course not found.",
        });
    }

    const previousThumbnail = {
        ...course.thumbnail,
    };

    let thumbnail = null;

    try {
        thumbnail = await uploadImageMedia({
            localFilePath: courseThumbnailTempPath,
            folder: CLOUDINARY_FOLDERS.COURSE_THUMBNAILS,
        });

        course.thumbnail = thumbnail;

        await courseRepository.saveCourse(course);

        logger.info(
            `Course thumbnail updated successfully. Course: ${course._id}, Instructor: ${instructorId}`
        );

        if (previousThumbnail?.publicId) {
            try {
                await destroyMedia({
                    publicId: previousThumbnail.publicId,
                    resourceType: MEDIA_RESOURCE_TYPES.IMAGE,
                });

                logger.info(
                    `Previous thumbnail deleted successfully. Public ID: ${previousThumbnail.publicId}`
                );
            } catch (error) {
                logger.error(
                    `Failed to delete previous thumbnail ${previousThumbnail.publicId}: ${error.message}`
                );
            }
        }

        return thumbnail;
    } catch (error) {
        if (thumbnail?.publicId) {
            await destroyMedia({
                publicId: thumbnail.publicId,
                resourceType: MEDIA_RESOURCE_TYPES.IMAGE,
            });

            logger.info(
                `Rolled back uploaded thumbnail after database failure. Public ID: ${thumbnail.publicId}`
            );

            course.thumbnail = previousThumbnail;
            await courseRepository.saveCourse(course);
        }
        throw error;
    }
};

///////////////////////////////////////////////////////////////
// publish course service

const publishCourse = async ({ courseId, instructorId }) => {
    const [course] = await courseRepository.getCoursePublishValidationData({
        courseId,
        instructorId,
    });

    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "Course not found",
        });
    }

    const { isValid, errors } = validateCoursePublishEligibility(course);

    if (!isValid && errors.length > 0) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Course is not eligible to be published.",
            errors,
        });
    }

    return await courseRepository.publishCourse(courseId);
};

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
