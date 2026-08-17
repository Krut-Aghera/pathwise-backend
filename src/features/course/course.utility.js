import ApiError from "../../utils/error-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";

import { COURSE_ERROR_MESSAGES } from "./course.constants.js";

//////////////////////////////////////////////////////////////
// get authorized instructor course

const getAuthorizedInstructorCourse = async ({ courseId, instructorId }) => {
    const course = await courseRepository.findInstructorCourseById({
        courseId,
        instructorId,
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
// validate eligibilty for course publish

const validateCoursePublishEligibility = (course) => {
    const errors = [];

    if (course.status !== RESOURCE_STATUS.DRAFT) {
        errors.push("Only draft courses can be published.");
    }

    if (!course.sections.length) {
        errors.push("Course must contain at least one section.");
    }

    for (const currentSection of course.sections) {
        if (!currentSection.lectures.length) {
            errors.push(`Section "${currentSection.title}" has no lectures.`);

            continue;
        }

        for (const currentLecture of currentSection.lectures) {
            if (
                !currentLecture.video ||
                !currentLecture.video.url ||
                !currentLecture.video.publicId
            ) {
                errors.push(
                    `Lecture "${currentLecture.title}" has no uploaded video.`
                );
            }

            if (currentLecture.status !== RESOURCE_STATUS.PUBLISHED) {
                errors.push(
                    `Lecture "${currentLecture.title}" is not published yet.`
                );
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

///////////////////////////////////////////////////////////////
// exports

export { getAuthorizedInstructorCourse, validateCoursePublishEligibility };
