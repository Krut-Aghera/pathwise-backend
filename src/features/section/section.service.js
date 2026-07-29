import * as courseRepository from "../course/course.repository.js";
import * as sectionRepository from "./section.repository.js";
import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { validateInstructorSectionOwnership } from "./section.utility.js";

///////////////////////////////////////////////////////////////
// create section service

const createSection = async ({ courseId, instructorId, title }) => {
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

const updateSection = async ({ sectionId, instructorId, data }) => {
    await validateInstructorSectionOwnership({
        sectionId,
        instructorId,
    });

    const section = await sectionRepository.updateSection({
        sectionId,
        data,
    });

    return section;
};

///////////////////////////////////////////////////////////////
// remove section service

const removeSection = async ({ sectionId, instructorId }) => {
    await validateInstructorSectionOwnership({ sectionId, instructorId });

    return sectionRepository.removeSection({ sectionId });
};

///////////////////////////////////////////////////////////////
// reorder sections service

const reorderSections = async ({ courseId, instructorId, sections }) => {};

///////////////////////////////////////////////////////////////
// publish section service

const publishSection = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// save section as draft service

const saveSectionAsDraft = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// fetch instructor section service

const fetchInstructorSection = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// fetch instructor sections service

const fetchInstructorSections = async ({ courseId, instructorId }) => {};

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
    fetchInstructorSections,
};
