import Progress from "../../src/features/progress/progress.model.js";

///////////////////////////////////////////////////////////////
// create test progress

const createTestProgress = async ({ studentId, courseId }) => {
    return await Progress.create({
        student: studentId,
        course: courseId,
    });
};

///////////////////////////////////////////////////////////////
// fetch test progress

const fetchTestProgress = async ({
    studentId,
    courseId,
    lectureId,
    watchedDuration = 0,
    isCompleted = false,
}) => {
    return await Progress.create({
        student: studentId,
        course: courseId,
        lectures: [
            {
                lecture: lectureId,
                watchedDuration,
                isCompleted,
            },
        ],
    });
};

///////////////////////////////////////////////////////////////
// make test lecture progress exists in course progress

const makeTestLectureProgressExists = async ({
    studentId,
    courseId,
    lectureId,
    lastPosition = 100,
    watchedDuration = 110,
    isCompleted = false,
}) => {
    return await Progress.findOneAndUpdate(
        {
            student: studentId,
            course: courseId,
        },
        {
            $push: {
                lectures: {
                    lecture: lectureId,
                    lastPosition,
                    watchedDuration,
                    isCompleted,
                },
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// exports

export { createTestProgress, fetchTestProgress, makeTestLectureProgressExists };
