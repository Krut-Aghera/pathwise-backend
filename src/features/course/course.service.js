import logger from "../../utils/pino-logger.utility.js";
import ApiError from "../../utils/error-handler.utility.js";
import generateSlug from "../../utils/slug-generator.utility.js";

import {
    getAuthorizedInstructorCourse,
    validateCoursePublishEligibility,
} from "./course.utility.js";

import {
    destroyMedia,
    uploadImageMedia,
} from "../../services/media/media.services.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import {
    COURSE_ERROR_MESSAGES,
    COURSE_QUERY_DEFAULTS,
} from "./course.constants.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";
import {
    CLOUDINARY_FOLDERS,
    MEDIA_RESOURCE_TYPES,
} from "../../services/media/media.constants.js";

import * as courseRepository from "./course.repository.js";

///////////////////////////////////////////////////////////////
// create course service

const createCourse = async ({
    instructorId,
    courseData,
    courseThumbnailTempPath,
}) => {
    const slug = generateSlug(courseData.title);

    const existingSlug = await courseRepository.findCourseBySlug({ slug });

    if (existingSlug) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: COURSE_ERROR_MESSAGES.COURSE_TITLE_ALREADY_EXISTS,
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

        const course = await courseRepository.createCourse({ coursePayload });
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

const updateCourse = async ({ courseId, instructorId, courseData }) => {
    const course = await getAuthorizedInstructorCourse({
        courseId,
        instructorId,
    });

    if (course.title !== courseData.title) {
        const slug = generateSlug(courseData.title);

        const existingCourse = await courseRepository.findCourseBySlug({
            slug,
        });

        if (
            existingCourse &&
            existingCourse._id.toString() !== course._id.toString()
        ) {
            throw new ApiError({
                statusCode: HTTP_STATUS.CONFLICT,
                message: COURSE_ERROR_MESSAGES.COURSE_TITLE_ALREADY_EXISTS,
            });
        }

        course.slug = slug;
    }

    Object.assign(course, courseData);

    return courseRepository.saveCourse({ course, validateBeforeSave: true });
};

///////////////////////////////////////////////////////////////
// update thumbnail service

const updateThumbnail = async ({
    courseId,
    instructorId,
    courseThumbnailTempPath,
}) => {
    const course = await getAuthorizedInstructorCourse({
        courseId,
        instructorId,
    });

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

        await courseRepository.saveCourse({ course });

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
            await courseRepository.saveCourse({ course });
        }
        throw error;
    }
};

///////////////////////////////////////////////////////////////
// remove course service

const removeCourse = async ({ courseId, instructorId }) => {
    await getAuthorizedInstructorCourse({ courseId, instructorId });

    courseRepository.softDeleteCourse({ courseId });
};

///////////////////////////////////////////////////////////////
// publish course service

const publishCourse = async ({ courseId, instructorId }) => {
    const [course] =
        await courseRepository.aggregateCoursePublishValidationData({
            courseId,
            instructorId,
        });

    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: COURSE_ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
    }

    const { isValid, errors } = validateCoursePublishEligibility(course);

    if (!isValid && errors.length > 0) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: COURSE_ERROR_MESSAGES.COURSE_NOT_ELIGIBLE_FOR_PUBLISH,
            errors,
        });
    }

    return courseRepository.toggleCourseStatus({
        courseId,
        status: RESOURCE_STATUS.PUBLISHED,
    });
};

///////////////////////////////////////////////////////////////
// Save course as draft

const saveCourseAsDraft = async ({ courseId, instructorId }) => {
    const course = await getAuthorizedInstructorCourse({
        courseId,
        instructorId,
    });

    if (course.status === RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: COURSE_ERROR_MESSAGES.COURSE_ALREADY_DRAFT,
        });
    }

    return courseRepository.toggleCourseStatus({
        courseId,
        status: RESOURCE_STATUS.DRAFT,
    });
};

///////////////////////////////////////////////////////////////
// fetch instructor courses service

const fetchInstructorCourses = ({ instructorId, page, limit }) => {
    const options = {
        instructor: instructorId,
        page: Number(page) || COURSE_QUERY_DEFAULTS.PAGE,
        limit: Number(limit) || COURSE_QUERY_DEFAULTS.LIMIT,
    };

    return courseRepository.findInstructorCourses({ options });
};

///////////////////////////////////////////////////////////////
// fetch instructor current course service

const fetchInstructorCourse = async ({ courseId, instructorId }) => {
    return getAuthorizedInstructorCourse({ courseId, instructorId });
};

///////////////////////////////////////////////////////////////
// fetch courses service

const fetchCourses = ({ queryData }) => {
    const { page, limit, search, sortBy, sortOrder, level, language } =
        queryData;

    const filters = {};

    if (level) {
        filters.level = level;
    }

    if (language) {
        filters.language = language;
    }

    const options = {
        pagination: {
            page: Number(page) || COURSE_QUERY_DEFAULTS.PAGE,
            limit: Number(limit) || COURSE_QUERY_DEFAULTS.LIMIT,
        },

        filters,

        sort: {
            by: sortBy ?? COURSE_QUERY_DEFAULTS.SORT_BY,
            order: sortOrder ?? COURSE_QUERY_DEFAULTS.SORT_ORDER,
        },
    };

    if (search) {
        options.search = search;
    }

    return courseRepository.findCourses({ options });
};

///////////////////////////////////////////////////////////////
// fetch current course service

const fetchCurrentCourse = async ({ courseId }) => {
    const [course] = await courseRepository.aggregateCurrentCourseData({
        courseId,
    });

    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: COURSE_ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
    }

    return course;
};

///////////////////////////////////////////////////////////////
// exports

export {
    createCourse,
    updateCourse,
    updateThumbnail,
    removeCourse,
    publishCourse,
    saveCourseAsDraft,
    fetchInstructorCourses,
    fetchInstructorCourse,
    fetchCourses,
    fetchCurrentCourse,
};
