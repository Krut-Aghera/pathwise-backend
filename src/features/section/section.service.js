import * as courseRepository from "../course/course.repository.js";
import * as sectionRepository from "./section.repository.js";
import * as lectureRepository from "../lecture/lecture.repository.js";
import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { validateInstructorSectionOwnership } from "./section.utility.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";

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

const publishSection = async ({ sectionId, instructorId }) => {
    const section = await validateInstructorSectionOwnership({
        sectionId,
        instructorId,
    });

    if (section.status !== RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Only draft section can be published.",
        });
    }

    const lectureCount = await lectureRepository.countSectionLectures({
        sectionId,
    });

    if (lectureCount === 0) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message:
                "Section must contain at least one lecture before publishing.",
        });
    }

    return sectionRepository.publishSection({ sectionId });
};

///////////////////////////////////////////////////////////////
// save section as draft service

const saveSectionAsDraft = async ({ sectionId, instructorId }) => {
    const section = await validateInstructorSectionOwnership({
        sectionId,
        instructorId,
    });

    if (section.status === RESOURCE_STATUS.DRAFT) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "This section is already saved as draft",
        });
    }

    return sectionRepository.saveSectionAsDraft({ sectionId });
};

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
