import mongoose from "mongoose";

import { REORDER_TEMP_OFFSET, RESOURCE_STATUS } from "../../constants/resource.constants.js";

import Section from "./section.model.js";

///////////////////////////////////////////////////////////////
// create section repository

const createSection = (sectionData) => {
    return Section.create(sectionData);
};

///////////////////////////////////////////////////////////////
// save section

const saveSection = ({ section, validateBeforeSave = false }) => {
    return section.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// remove section

const removeSection = ({ sectionId }) => {
    return Section.findByIdAndUpdate(
        {
            _id: sectionId,
            isDeleted: false,
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

const reorderSections = async ({ sections }) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Phase 1: Move all sections to temporary orders
        await Section.bulkWrite(
            sections.map(({ sectionId, order }) => ({
                updateOne: {
                    filter: { _id: sectionId },
                    update: {
                        $set: {
                            order: order + REORDER_TEMP_OFFSET,
                        },
                    },
                },
            })),
            { session }
        );

        // Phase 2: Assign final orders
        await Section.bulkWrite(
            sections.map(({ sectionId, order }) => ({
                updateOne: {
                    filter: { _id: sectionId },
                    update: {
                        $set: {
                            order,
                        },
                    },
                },
            })),
            { session }
        );

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

///////////////////////////////////////////////////////////////
// toggle section status

const toggleSectionStatus = ({ sectionId, status }) => {
    return Section.findByIdAndUpdate(
        {
            _id: sectionId,
            isDeleted: false,
        },
        {
            $set: {
                status,
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
// find section by course

const findSectionByCourse = ({ courseId }) => {
    return Section.find({
        course: courseId,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find last section order

const findLastSectionOrder = (courseId) => {
    return Section.findOne({
        course: courseId,
        isDeleted: false,
    })
        .sort({
            order: -1,
        })
        .select("order")
        .lean();
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
// find course sections repository

const findCourseSections = ({ courseId }) => {
    return Section.find({
        course: courseId,
        isDeleted: false,
    })
        .select("_id title order status")
        .sort({ order: 1 })
        .lean();
};

///////////////////////////////////////////////////////////////
// find course section ids

const findCourseSectionIds = ({ courseId }) => {
    return Section.find({
        course: courseId,
        isDeleted: false,
    })
        .select("_id")
        .lean();
};

///////////////////////////////////////////////////////////////
// exports

export {
    createSection,
    saveSection,
    removeSection,
    reorderSections,
    toggleSectionStatus,
    findSectionByTitle,
    findLastSectionOrder,
    findInstructorSection,
    findCourseSections,
    findCourseSectionIds,
    findSectionByCourse,
};
