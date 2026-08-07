import * as courseRepository from "../course/course.repository.js";
import * as sectionRepository from "./section.repository.js";
import * as lectureRepository from "../lecture/lecture.repository.js";

import ApiError from "../../utils/error-handler.utility.js";
import { getAuthorizedInstructorCourse } from "../course/course.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";
import { COURSE_ERROR_MESSAGES } from "../course/course.constants.js";
import { SECTION_ERROR_MESSAGES } from "./section.constants.js";
import {
    getAuthorizedInstructorSection,
    validateCourseSectionReorder,
    validateSectionReorderPayload,
} from "./section.utility.js";

///////////////////////////////////////////////////////////////
// create section service

const createSection = async ({ courseId, instructorId, title }) => {
    await getAuthorizedInstructorCourse({ courseId, instructorId });

    const lastSection = await sectionRepository.findLastSectionOrder(courseId);

    const order = lastSection ? lastSection.order + 1 : 1;

    return sectionRepository.createSection({
        course: courseId,
        title,
        order,
    });
};

///////////////////////////////////////////////////////////////
// update section service

const updateSection = async ({ sectionId, instructorId, sectionData }) => {
    const section = await getAuthorizedInstructorSection({
        sectionId,
        instructorId,
    });

    Object.assign(section, sectionData);

    return sectionRepository.saveSection({ section, validateBeforeSave: true });
};

///////////////////////////////////////////////////////////////
// remove section service

const removeSection = async ({ sectionId, instructorId }) => {
    await getAuthorizedInstructorSection({
        sectionId,
        instructorId,
    });

    return sectionRepository.removeSection({ sectionId });
};

///////////////////////////////////////////////////////////////
// reorder sections service

const reorderSections = async ({ courseId, instructorId, sections }) => {
    await getAuthorizedInstructorCourse({
        courseId,
        instructorId,
    });

    validateSectionReorderPayload({ sections });

    const courseSections = await sectionRepository.findCourseSectionIds({
        courseId,
    });

    validateCourseSectionReorder({
        sections,
        courseSections,
    });

    await sectionRepository.reorderSections({ sections });
};

///////////////////////////////////////////////////////////////
// publish section service

const publishSection = async ({ sectionId, instructorId }) => {
    const section = await getAuthorizedInstructorSection({
        sectionId,
        instructorId,
    });

    if (section.status !== RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: SECTION_ERROR_MESSAGES.SECTION_NOT_DRAFT,
        });
    }

    const lectureCount = await lectureRepository.countSectionLectures({
        sectionId,
    });

    if (lectureCount === 0) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: SECTION_ERROR_MESSAGES.SECTION_MUST_CONTAIN_LECTURE,
        });
    }

    return sectionRepository.toggleSectionStatus({
        sectionId,
        status: RESOURCE_STATUS.PUBLISHED,
    });
};

///////////////////////////////////////////////////////////////
// save section as draft service

const saveSectionAsDraft = async ({ sectionId, instructorId }) => {
    const section = await getAuthorizedInstructorSection({
        sectionId,
        instructorId,
    });

    if (section.status === RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: SECTION_ERROR_MESSAGES.SECTION_ALREADY_DRAFT,
        });
    }

    return sectionRepository.toggleSectionStatus({
        sectionId,
        status: RESOURCE_STATUS.DRAFT,
    });
};

///////////////////////////////////////////////////////////////
// fetch instructor section service

const fetchInstructorSection = async ({ sectionId, instructorId }) => {
    return await getAuthorizedInstructorSection({ sectionId, instructorId });
};

///////////////////////////////////////////////////////////////
// fetch course sections service

const fetchCourseSections = async ({ courseId, instructorId }) => {
    const course = await getAuthorizedInstructorCourse({
        courseId,
        instructorId,
    });

    return await sectionRepository.findCourseSections({
        courseId: course._id,
    });
};

///////////////////////////////////////////////////////////////
// exports

export {
    createSection,
    updateSection,
    removeSection,
    reorderSections,
    publishSection,
    saveSectionAsDraft,
    fetchInstructorSection,
    fetchCourseSections,
};
