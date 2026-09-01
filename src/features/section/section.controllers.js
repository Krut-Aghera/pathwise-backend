import ApiResponse from "../../utils/response-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";

import {
    SECTION_SUCCESS_MESSAGES,
    SECTION_UPDATE_FIELDS,
} from "./section.constants.js";

import * as sectionService from "./section.service.js";

///////////////////////////////////////////////////////////////
// create section controller

const createSection = async (req, res) => {
    const section = await sectionService.createSection({
        courseId: req.params.courseId,
        instructorId: req.user._id,
        title: req.body.title,
    });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.CREATED,
            message: SECTION_SUCCESS_MESSAGES.SECTION_CREATED,
            data: section,
        })
    );
};

///////////////////////////////////////////////////////////////
// update section controller

const updateSection = async (req, res) => {
    const sectionData = SECTION_UPDATE_FIELDS.reduce((acc, key) => {
        if (req.body[key] !== undefined) {
            acc[key] = req.body[key];
        }
        return acc;
    }, {});

    const section = await sectionService.updateSection({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
        sectionData,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: SECTION_SUCCESS_MESSAGES.SECTION_UPDATED,
            data: section,
        })
    );
};

///////////////////////////////////////////////////////////////
// remove section controller

const removeSection = async (req, res) => {
    await sectionService.removeSection({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: SECTION_SUCCESS_MESSAGES.SECTION_DELETED,
        })
    );
};

///////////////////////////////////////////////////////////////
// reorder sections controller

const reorderSections = async (req, res) => {
    await sectionService.reorderSections({
        courseId: req.params.courseId,
        instructorId: req.user._id,
        sections: req.body.sections,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: SECTION_SUCCESS_MESSAGES.SECTIONS_REORDERED,
        })
    );
};

///////////////////////////////////////////////////////////////
// publish section controller

const publishSection = async (req, res) => {
    const section = await sectionService.publishSection({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: SECTION_SUCCESS_MESSAGES.SECTION_PUBLISHED,
            data: section,
        })
    );
};

///////////////////////////////////////////////////////////////
// save section as draft controller

const saveSectionAsDraft = async (req, res) => {
    const section = await sectionService.saveSectionAsDraft({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: SECTION_SUCCESS_MESSAGES.SECTION_SAVED_AS_DRAFT,
            data: section,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch instructor current section controller

const fetchInstructorSection = async (req, res) => {
    const section = await sectionService.fetchInstructorSection({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: SECTION_SUCCESS_MESSAGES.SECTION_FETCHED,
            data: section,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch course sections controller

const fetchCourseSections = async (req, res) => {
    const sections = await sectionService.fetchCourseSections({
        courseId: req.params.courseId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: SECTION_SUCCESS_MESSAGES.SECTIONS_FETCHED,
            data: sections,
        })
    );
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
