import * as sectionService from "./section.service.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiResponse from "../../utils/response-handler.utility.js";

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
            message: `${section.title} created successfully.`,
            data: section,
        })
    );
};

///////////////////////////////////////////////////////////////
// update section controller

const updateSection = async (req, res) => {
    const data = SECTION_UPDATE_FIELDS.reduce((acc, key) => {
        if (req.body[key] !== undefined) {
            acc[key] = req.body[key];
        }
        return acc;
    }, {});

    const section = await sectionService.updateSection({
        sectionId: req.params.sectionId,
        instructorId: req.user._id,
        data,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: `${section.title} updated successfully.`,
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
            message: `${section.title} removed successfully.`,
        })
    );
};

///////////////////////////////////////////////////////////////
// reorder sections controller

const reorderSections = async (req, res) => {
    const sections = await sectionService.reorderSections({
        courseId: req.params.courseId,
        instructorId: req.user._id,
        sections: req.body.sections,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: "Sections reordered successfully.",
            data: sections,
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
            message: `${section.title} published successfully.`,
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
            message: `${section.title} saved as draft successfully.`,
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
            message: `${section.title} fetched successfully.`,
            data: section,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch instructor sections controller

const fetchInstructorSections = async (req, res) => {
    const sections = await sectionService.fetchInstructorSections({
        courseId: req.params.courseId,
        instructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: "Sections fetched successfully.",
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
    fetchInstructorSections,
    fetchInstructorSection,
};
