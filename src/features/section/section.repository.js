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
// save section

const saveSection = ({ section, validateBeforeSave = false }) => {
    return section.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// remove section

const removeSection = async ({ sectionId }) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Find section

        const section = await Section.findOne({
            _id: sectionId,
            isDeleted: false,
        })
            .select("_id course order")
            .session(session)
            .lean();

        if (!section) {
            await session.abortTransaction();

            return null;
        }

        // Soft delete section

        await Section.updateOne(
            {
                _id: sectionId,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true,
                    status: RESOURCE_STATUS.DRAFT,
                },
            },
            {
                session,
            }
        );

        // Find remaining sections

        const remainingSections = await Section.find({
            course: section.course,
            isDeleted: false,
        })
            .select("_id order")
            .sort({
                order: 1,
            })
            .session(session)
            .lean();

        // Phase 1: Move remaining sections to temporary orders

        await Section.bulkWrite(
            remainingSections.map(({ _id, order }) => ({
                updateOne: {
                    filter: {
                        _id,
                    },
                    update: {
                        $set: {
                            order: order + REORDER_TEMP_OFFSET,
                        },
                    },
                },
            })),
            {
                session,
            }
        );

        // Phase 2: Assign normalized orders

        await Section.bulkWrite(
            remainingSections.map(({ _id }, index) => ({
                updateOne: {
                    filter: {
                        _id,
                    },
                    update: {
                        $set: {
                            order: index + 1,
                        },
                    },
                },
            })),
            {
                session,
            }
        );

        // Commit

        await session.commitTransaction();

        return section;
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        await session.endSession();
    }
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
// update section status

const updateSectionStatus = ({ sectionId, currentStatus, nextStatus }) => {
    return Section.findOneAndUpdate(
        {
            _id: sectionId,
            status: currentStatus,
            isDeleted: false,
        },
        {
            $set: {
                status: nextStatus,
            },
        },
        {
            returnDocument: "after",
        }
    );
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
// check if course has a published section

const existsPublishedSectionByCourse = ({ courseId }) => {
    return Section.exists({
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
        select: "_id instructor title",
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
    updateSectionStatus,
    findLastSectionOrder,
    findInstructorSection,
    findCourseSections,
    existsPublishedSectionByCourse,
    findCourseSectionIds,
    findSectionByCourse,
};
