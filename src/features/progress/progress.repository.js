import { PROGRESS_STATUS } from "./progress.constants.js";
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

const initializeLectureProgress = ({
    progressId,
    lectureProgress,
    isCourseStarting,
}) => {
    const updateFields = {
        status: PROGRESS_STATUS.IN_PROGRESS,
        lastAccessedLecture: lectureProgress.lecture,
    };

    if (isCourseStarting) {
        updateFields.startedAt = Date.now();
    }

    return Progress.findByIdAndUpdate(
        progressId,
        {
            $push: {
                lectures: lectureProgress,
            },

            $set: updateFields,
        },
        {
            returnDocument: "after",
        }
    );
};

////////////////////////////////////////////////////////////////
// update last accessed lecture

const updateLastAccessedLecture = ({ progressId, lectureId }) => {
    return Progress.findByIdAndUpdate(
        progressId,
        {
            $set: {
                lastAccessedLecture: lectureId,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

////////////////////////////////////////////////////////////////
// update lecture progress

const updateLectureProgress = ({ progressId, lectureId, progressData }) => {
    const updateFields = Object.fromEntries(
        Object.entries(progressData).map(([key, value]) => [
            `lectures.$.${key}`,
            value,
        ])
    );

    updateFields.lastAccessedLecture = lectureId;

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

const completeLectureProgress = ({ progressId, lectureId }) => {
    return Progress.findOneAndUpdate(
        {
            _id: progressId,
            "lectures.lecture": lectureId,
        },
        {
            $set: {
                "lectures.$.isCompleted": true,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

////////////////////////////////////////////////////////////////
// complete course progress

const completeCourseProgress = ({ progressId, completedAt }) => {
    return Progress.findOneAndUpdate(
        {
            _id: progressId,
            status: {
                $ne: PROGRESS_STATUS.COMPLETED,
            },
        },
        {
            $set: {
                status: PROGRESS_STATUS.COMPLETED,
                completedAt,
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
    updateLastAccessedLecture,
    updateLectureProgress,
    completeLectureProgress,
    completeCourseProgress,
};
