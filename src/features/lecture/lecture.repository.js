import Lecture from "../lecture/lecture.model.js";

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
// exports

export {
    createLecture,
    saveLecture,
    countSectionLectures,
    findLastLectureOrder,
    findInstructorLecture,
};
