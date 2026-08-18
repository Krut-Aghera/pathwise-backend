import { PROGRESS_CONFIG } from "./progress.constants.js";

////////////////////////////////////////////////////////////////
// calculate lecture progress percentage

const calculateLectureProgressPercentage = ({ watchedDuration, duration }) => {
    if (duration <= 0) {
        return 0;
    }

    const percentage = (watchedDuration / duration) * 100;
    return Math.min(Math.max(percentage, 0), 100);
};

////////////////////////////////////////////////////////////////
// check lecture completion threshold

const hasLectureReachedCompletionThreshold = ({
    watchedDuration,
    duration,
}) => {
    if (duration <= 0) {
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
// calculate section progress percentage

const calculateSectionProgressPercentage = ({
    completedLectures,
    totalLectures,
}) => {
    if (totalLectures <= 0) {
        return 0;
    }

    const percentage = (completedLectures / totalLectures) * 100;
    return Math.min(Math.max(percentage, 0), 100);
};

////////////////////////////////////////////////////////////////
// calculate course progress percentage

const calculateCourseProgressPercentage = ({
    completedLectures,
    totalLectures,
}) => {
    if (totalLectures <= 0) {
        return 0;
    }

    const percentage = (completedLectures / totalLectures) * 100;
    return Math.min(Math.max(percentage, 0), 100);
};

////////////////////////////////////////////////////////////////
// exports

export {
    calculateLectureProgressPercentage,
    hasLectureReachedCompletionThreshold,
    calculateSectionProgressPercentage,
    calculateCourseProgressPercentage,
};
