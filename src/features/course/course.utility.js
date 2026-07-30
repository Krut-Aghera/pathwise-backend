import mongoose from "mongoose";
import * as courseRepository from "./course.repository.js";
import Course from "./course.model.js";
import { VIDEO_UPLOAD_STATUS } from "../lecture/lecture.constants.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";

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
            message: "Course not found.",
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

            if (!currentLecture.duration) {
                errors.push(
                    `Lecture "${currentLecture.title}" has no duration.`
                );
            }

            if (currentLecture.uploadStatus !== VIDEO_UPLOAD_STATUS.READY) {
                errors.push(
                    `Lecture "${currentLecture.title}" is not ready to publish yet.`
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
