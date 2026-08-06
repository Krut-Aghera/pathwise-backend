import mongoose from "mongoose";
import Lecture from "../lecture/lecture.model.js";
import {
    REORDER_TEMP_OFFSET,
    RESOURCE_STATUS,
} from "../../constants/resource.constants.js";
import { STUDENT_LECTURE_SELECT_FIELDS } from "./lecture.constants.js";

///////////////////////////////////////////////////////////////
// create lecture

const createLecture = ({ lecturePayload }) => {
    return Lecture.create(lecturePayload);
};

///////////////////////////////////////////////////////////////
// create lecture

const saveLecture = ({ lecture, validateBeforeSave = false }) => {
    return lecture.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// count section lectures repository

const countSectionLectures = ({ sectionId }) => {
    return Lecture.countDocuments({
        section: sectionId,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// reorder lecture repository

const reorderLectures = async ({ lectures }) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Phase 1: Move all lectures to temporary orders
        await Lecture.bulkWrite(
            lectures.map(({ lectureId, order }) => ({
                updateOne: {
                    filter: {
                        _id: lectureId,
                        isDeleted: false,
                    },
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

        await Lecture.bulkWrite(
            lectures.map(({ lectureId, order }) => ({
                updateOne: {
                    filter: {
                        _id: lectureId,
                        isDeleted: false,
                    },
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
// find last section order

const findLastLectureOrder = ({ sectionId }) => {
    return Lecture.findOne({
        section: sectionId,
        isDeleted: false,
    })
        .sort({
            order: -1,
        })
        .select("order")
        .lean();
};

///////////////////////////////////////////////////////////////
// find section lecture ids

const findSectionLectureIds = ({ sectionId }) => {
    return Lecture.find({
        section: sectionId,
        isDeleted: false,
    })
        .select("_id")
        .lean();
};

///////////////////////////////////////////////////////////////
// find instructor lecture

const findInstructorLecture = ({ lectureId, instructorId }) => {
    return Lecture.findOne({
        _id: lectureId,
        isDeleted: false,
    }).populate({
        path: "section",
        match: {
            isDeleted: false,
        },
        select: "_id course",
        populate: {
            path: "course",
            match: {
                instructor: instructorId,
                isDeleted: false,
            },
            select: "_id instructor",
        },
    });
};

///////////////////////////////////////////////////////////////
// find published lecture

const findPublishedLecture = ({ lectureId }) => {
    return Lecture.findOne({
        _id: lectureId,
        isDeleted: false,
        status: RESOURCE_STATUS.PUBLISHED,
    })
        .populate({
            path: "section",
            match: {
                isDeleted: false,
                status: RESOURCE_STATUS.PUBLISHED,
            },
            select: "_id course",
            populate: {
                path: "course",
                match: {
                    isDeleted: false,
                    status: RESOURCE_STATUS.PUBLISHED,
                },
                select: "_id",
            },
        })
        .select(STUDENT_LECTURE_SELECT_FIELDS);
};

///////////////////////////////////////////////////////////////
// find section lectures

const findSectionLectures = ({ sectionId }) => {
    return Lecture.find({
        section: sectionId,
        isDeleted: false,
    }).sort({ order: 1 });
};

///////////////////////////////////////////////////////////////
// exports

export {
    createLecture,
    saveLecture,
    countSectionLectures,
    reorderLectures,
    findSectionLectureIds,
    findLastLectureOrder,
    findInstructorLecture,
    findSectionLectures,
    findPublishedLecture,
};
