import mongoose from "mongoose";
import {
    REORDER_TEMP_OFFSET,
    RESOURCE_STATUS,
} from "../../constants/resource.constants.js";
import Section from "./section.model.js";

///////////////////////////////////////////////////////////////
// create section repository

const createSection = (sectionData) => {
    return Section.create(sectionData);
};

///////////////////////////////////////////////////////////////
// update section

const updateSection = ({ sectionId, data }) => {
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
    updateSection,
    removeSection,
    reorderSections,
    publishSection,
    saveSectionAsDraft,
    findSectionByTitle,
    findLastSectionOrder,
    findInstructorSection,
    findCourseSections,
    findCourseSectionIds,
};
