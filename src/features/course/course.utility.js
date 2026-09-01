import ApiError from "../../utils/error-handler.utility.js";
import * as courseRepository from "../course/course.repository.js";
import * as sectionRepository from "../section/section.repository.js";
import HTTP_STATUS from "../../constants/http.constants.js";

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
// reconcile course publication
//
// A published course must have at least one
// published, non-deleted section.
//
// If no published section remains, the course is
// automatically moved from PUBLISHED to DRAFT.
//
// Returns:
// - updated course when status changes
// - null when course remains published

const reconcileCoursePublication = async ({ courseId }) => {
    const hasPublishedSection =
        await sectionRepository.existsPublishedSectionByCourse({
            courseId,
        });

    if (hasPublishedSection) {
        return null;
    }

    return courseRepository.updatePublishedCourseToDraft({
        courseId,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { getAuthorizedInstructorCourse, reconcileCoursePublication };
