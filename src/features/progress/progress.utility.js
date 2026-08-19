import { PROGRESS_CONFIG } from "./progress.constants.js";

////////////////////////////////////////////////////////////////
// build progress calculated meta

const buildProgressCalculatedMeta = ({ progress, lectures }) => {
    // create lecture progress lookup

    const lectureProgressByLectureId = new Map(
        progress.lectures.map((lectureProgress) => [
            lectureProgress.lecture.toString(),
            lectureProgress,
        ])
    );

    // calculate lecture progress

    const calculatedLectures = lectures.map((lecture) => {
        const lectureProgress = lectureProgressByLectureId.get(
            lecture._id.toString()
        );

        const watchedDuration = lectureProgress?.watchedDuration ?? 0;

        const progressPercentage = calculateLectureProgressPercentage({
            watchedDuration,
            duration: lecture.video.duration,
        });

        return {
            lectureId: lecture._id,
            progressPercentage,
        };
    });

    // calculate course statistics

    const totalLectures = lectures.length;

    const completedLectures = lectures.reduce((count, lecture) => {
        const lectureProgress = lectureProgressByLectureId.get(
            lecture._id.toString()
        );

        return count + (lectureProgress?.isCompleted ? 1 : 0);
    }, 0);

    const totalDuration = lectures.reduce((total, lecture) => {
        return total + lecture.video.duration;
    }, 0);

    const totalCompletedDuration = lectures.reduce((total, lecture) => {
        const lectureProgress = lectureProgressByLectureId.get(
            lecture._id.toString()
        );

        if (!lectureProgress?.isCompleted) {
            return total;
        }

        return total + lecture.video.duration;
    }, 0);

    const progressPercentage = calculateCourseProgressPercentage({
        completedLectures,
        totalLectures,
    });

    // return calculated meta

    return {
        lectures: calculatedLectures,

        course: {
            totalLectures,
            completedLectures,
            totalDuration,
            totalCompletedDuration,
            progressPercentage,
        },
    };
};

////////////////////////////////////////////////////////////////
// calculate lecture progress percentage

const calculateLectureProgressPercentage = ({ watchedDuration, duration }) => {
    if (
        !Number.isFinite(watchedDuration) ||
        !Number.isFinite(duration) ||
        duration <= 0
    ) {
        return 0;
    }

    const percentage = (watchedDuration / duration) * 100;
    return Math.min(Math.max(percentage, 0), 100);
};

////////////////////////////////////////////////////////////////
// calculate course progress percentage

const calculateCourseProgressPercentage = ({
    completedLectures,
    totalLectures,
}) => {
    if (
        !Number.isFinite(completedLectures) ||
        !Number.isFinite(totalLectures) ||
        totalLectures <= 0
    ) {
        return 0;
    }

    const percentage = (completedLectures / totalLectures) * 100;
    return Math.min(Math.max(percentage, 0), 100);
};

////////////////////////////////////////////////////////////////
// check lecture completion threshold

const hasLectureReachedCompletionThreshold = ({
    watchedDuration,
    duration,
}) => {
    if (duration <= 0 || watchedDuration < 0 || watchedDuration > duration) {
        return false;
    }

    const completionPercentage = calculateLectureProgressPercentage({
        watchedDuration,
        duration,
    });

    return (
        completionPercentage >= PROGRESS_CONFIG.LECTURE_COMPLETION_PERCENTAGE
    );
};

////////////////////////////////////////////////////////////////
// exports

export {
    buildProgressCalculatedMeta,
    calculateLectureProgressPercentage,
    calculateCourseProgressPercentage,
    hasLectureReachedCompletionThreshold,
};
