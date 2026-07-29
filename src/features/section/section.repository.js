import { RESOURCE_STATUS } from "../../constants/resource.constants.js";
import Section from "./section.model.js";

///////////////////////////////////////////////////////////////
// create section repository

const createSection = (sectionData) => {
    return Section.create(sectionData);
};

///////////////////////////////////////////////////////////////
// update section

const updateSection = (sectionId, data) => {
    return Section.findByIdAndUpdate(
        {
            _id: sectionId,
            isDeleted: false,
        },
        {
            $set: data,
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
};

///////////////////////////////////////////////////////////////
// remove section

const removeSection = (sectionId) => {
    return Section.findByIdAndUpdate(
        {
            _id: sectionId,
        },
        {
            $set: {
                isDeleted: true,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// reorder sections repository

const reorderSections = async ({ courseId, sections }) => {};

///////////////////////////////////////////////////////////////
// publish section repository

const publishSection = ({ sectionId }) => {
    return Section.findByIdAndUpdate(
        {
            _id: sectionId,
            isDeleted: false,
        },
        {
            $set: {
                status: RESOURCE_STATUS.PUBLISHED,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// save section as draft repository

const saveSectionAsDraft = async ({ sectionId }) => {
    return Section.findByIdAndUpdate(
        {
            _id: sectionId,
            isDeleted: false,
        },
        {
            $set: {
                status: RESOURCE_STATUS.DRAFT,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// find section by title inside course

const findSectionByTitle = ({ courseId, title }) => {
    return Section.findOne({
        course: courseId,
        title,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find last section order

const findLastSectionOrder = (courseId) => {
    return Section.findOne({
        course: courseId,
        isDeleted: false,
    }).sort({
        order: -1,
    });
};

///////////////////////////////////////////////////////////////
// find instructor section

const findInstructorSection = ({ sectionId, instructorId }) => {
    return Section.findOne({
        _id: sectionId,
        isDeleted: false,
    }).populate({
        path: "course",
        match: {
            instructor: instructorId,
            isDeleted: false,
        },
        select: "_id instructor",
    });
};

///////////////////////////////////////////////////////////////
// fetch instructor course sections repository

const findInstructorSections = async ({ courseId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// exports

export {
    createSection,
    updateSection,
    removeSection,
    reorderSections,
    publishSection,
    saveSectionAsDraft,
    findSectionByTitle,
    findLastSectionOrder,
    findInstructorSection,
    findInstructorSections,
};
