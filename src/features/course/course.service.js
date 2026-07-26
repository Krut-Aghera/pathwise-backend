import HTTP_STATUS from "../../constants/http-status.js";
import {
    CLOUDINARY_FOLDERS,
    MEDIA_RESOURCE_TYPES,
} from "../../services/media/media.constants.js";
import {
    destroyMedia,
    uploadImageMedia,
} from "../../services/media/media.services.js";
import ApiError from "../../utils/error-handler.utility.js";
import generateSlug from "../../utils/slug-generator.utility.js";
import logger from "../../utils/pino-logger.utility.js";
import * as courseRepository from "./course.repository.js";
import { validateCoursePublishEligibility } from "./course.utility.js";
import { COURSE_QUERY_DEFAULTS } from "./course.constans.js";

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

const updateCourse = async ({ courseId, instructorId, courseData }) => {
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

    // Only regenerate slug if title changed
    if (course.title !== courseData.title) {
        const slug = generateSlug(courseData.title);

        const existingCourse = await courseRepository.findCourseBySlug(slug);

        if (
            existingCourse &&
            existingCourse._id.toString() !== course._id.toString()
        ) {
            throw new ApiError({
                statusCode: HTTP_STATUS.CONFLICT,
                message: "A course with this title already exists.",
            });
        }

        course.slug = slug;
    }

    Object.assign(course, courseData);

    return courseRepository.saveCourse(course, true);
};

///////////////////////////////////////////////////////////////
// remove course service

const removeCourse = async ({ courseId, instructorId }) => {
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

    courseRepository.softDeleteCourse(courseId);
};

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
    const [course] = await courseRepository.fetchCoursePublishValidationData({
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

    return courseRepository.publishCourse(courseId);
};

///////////////////////////////////////////////////////////////
// Save course as draft

const saveCourseAsDraft = async ({ courseId, instructorId }) => {
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

    if (course.status === COURSE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Course is already saved as draft.",
        });
    }

    return courseRepository.saveCourseAsDraft(courseId);
};

///////////////////////////////////////////////////////////////
// fetch instructor current course service

const fetchInstructorCourse = async ({ courseId, instructorId }) => {
    const course = await courseRepository.findInstructorCourseById({
        courseId,
        instructorId,
    });

    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "course not found",
        });
    }

    return course;
};

///////////////////////////////////////////////////////////////
// fetch courses service // public

const fetchCourses = async (queryData) => {
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
            page: page ?? COURSE_QUERY_DEFAULTS.PAGE,
            limit: limit ?? COURSE_QUERY_DEFAULTS.LIMIT,
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

    return courseRepository.fetchCourses(options);
};

///////////////////////////////////////////////////////////////
// fetch current course service // public

const fetchCurrentCourse = async ({ courseId }) => {
    const course = await courseRepository.findCourseById(courseId);

    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "course not found",
        });
    }

    return course;
};

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
    saveCourseAsDraft,
    fetchCourses,
    fetchCurrentCourse,
    fetchInstructorCourse,
    fetchInstructorCourses,
};
