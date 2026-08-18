import Progress from "./progress.model.js";

////////////////////////////////////////////////////////////////
// find student course progress

const findProgressByStudentAndCourse = ({ studentId, courseId }) => {
    return Progress.findOne({
        student: studentId,
        course: courseId,
    });
};

////////////////////////////////////////////////////////////////
// create student course progress

const createProgress = ({ studentId, courseId }) => {
    return Progress.create({
        student: studentId,
        course: courseId,
    });
};

////////////////////////////////////////////////////////////////
// initialize lecture progress

const initializeLectureProgress = async ({ progressId, lectureProgress }) => {
    return Progress.findByIdAndUpdate(
        progressId,
        {
            $push: {
                lectures: lectureProgress,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

////////////////////////////////////////////////////////////////
// update lecture progress

const updateLectureProgress = ({ progressId, lectureId, progressPayload }) => {
    const updateFields = {};

    Object.entries(progressPayload).forEach(([key, value]) => {
        updateFields[`lectures.$.${key}`] = value;
    });

    updateFields["lectures.$.lastAccessedAt"] = new Date();

    return Progress.findOneAndUpdate(
        {
            _id: progressId,
            "lectures.lecture": lectureId,
        },
        {
            $set: updateFields,
        },
        {
            returnDocument: "after",
        }
    );
};

////////////////////////////////////////////////////////////////
// complete lecture progress

const completeLectureProgress = ({
    progressId,
    lectureId,
    completedAt,
    lastCompletedLecture,
    status,
}) => {
    return Progress.findOneAndUpdate(
        {
            _id: progressId,
            "lectures.lecture": lectureId,
        },
        {
            $set: {
                "lectures.$.isCompleted": true,
                "lectures.$.completedAt": completedAt,
                lastCompletedLecture,
                status,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

////////////////////////////////////////////////////////////////
// exports

export {
    findProgressByStudentAndCourse,
    createProgress,
    initializeLectureProgress,
    updateLectureProgress,
    completeLectureProgress,
};
