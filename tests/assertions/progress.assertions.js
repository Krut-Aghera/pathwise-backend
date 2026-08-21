import { expect } from "vitest";
import { PROGRESS_STATUS } from "../../src/features/progress/progress.constants";

////////////////////////////////////////////////////////////////////////////////
// expect successful response

const expectSuccessfulResponse = (response) => {
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.meta).toBeDefined();
};

////////////////////////////////////////////////////////////////////////////////
// expect failed response

const expectFailedResponse = (response, status) => {
    expect(response.status).toBe(status);
    expect(response.body.success).toBe(false);
};

////////////////////////////////////////////////////////////////////////////////
// expect course progress summary

const expectCourseProgressSummary = ({
    response,
    totalLectures,
    completedLectures,
    totalDuration,
    totalCompletedDuration,
    progressPercentage,
}) => {
    const courseProgress = response.body.meta.course;

    expect(courseProgress.totalLectures).toBe(totalLectures);
    expect(courseProgress.completedLectures).toBe(completedLectures);
    expect(courseProgress.progressPercentage).toBe(progressPercentage);

    if (totalDuration !== undefined) {
        expect(courseProgress.totalDuration).toBe(totalDuration);
    }

    if (totalCompletedDuration !== undefined) {
        expect(courseProgress.totalCompletedDuration).toBe(
            totalCompletedDuration
        );
    }
};

////////////////////////////////////////////////////////////////////////////////
// expect lecture progress summary

const expectLectureProgressSummary = ({
    response,
    lecture,
    progressPercentage,
    lectureCount = 1,
}) => {
    const lectures = response.body.meta.lectures;

    expect(lectures).toHaveLength(lectureCount);

    if (lecture && lectureCount === 1) {
        expect(lectures[0].lectureId.toString()).toBe(lecture._id.toString());
    }

    if (progressPercentage !== undefined && lectureCount === 1) {
        expect(lectures[0].progressPercentage).toBe(progressPercentage);
    }
};

////////////////////////////////////////////////////////////////////////////////
// expect progress data

const expectProgressData = ({ response, user, course, status }) => {
    const progress = response.body.data;

    expect(progress.course.toString()).toBe(course._id.toString());
    expect(progress.student.toString()).toBe(user._id.toString());
    expect(progress.status).toBe(status);
};

////////////////////////////////////////////////////////////////////////////////
// expect lecture progress data

const expectLectureProgressData = ({
    response,
    lecture,
    lastPosition,
    watchedDuration,
    isCompleted,
}) => {
    const lectureProgress = response.body.data.lectures.find(
        ({ lecture: lectureId }) =>
            lectureId.toString() === lecture._id.toString()
    );

    expect(lectureProgress).toBeDefined();
    expect(lectureProgress.lastPosition).toBe(lastPosition);
    expect(lectureProgress.watchedDuration).toBe(watchedDuration);
    expect(lectureProgress.isCompleted).toBe(isCompleted);
};

////////////////////////////////////////////////////////////////////////////////
// expect last accessed lecture

const expectLastAccessedLecture = ({ response, lecture }) => {
    expect(response.body.data.lastAccessedLecture.toString()).toBe(
        lecture._id.toString()
    );
};

////////////////////////////////////////////////////////////////////////////////
// expect course completion

const expectCompletedCourse = ({ response, totalLectures }) => {
    expect(response.body.meta.course.totalLectures).toBe(totalLectures);
    expect(response.body.meta.course.completedLectures).toBe(totalLectures);
    expect(response.body.meta.course.progressPercentage).toBe(100);
    expect(response.body.meta.lectures).toHaveLength(totalLectures);

    expect(
        response.body.meta.lectures.every(
            ({ progressPercentage }) => progressPercentage === 100
        )
    ).toBe(true);

    expect(response.body.data.status).toBe(PROGRESS_STATUS.COMPLETED);
    expect(response.body.data.completedAt).toBeDefined();
    expect(response.body.data.completedAt).not.toBeNull();
};

export {
    expectSuccessfulResponse,
    expectFailedResponse,
    expectCourseProgressSummary,
    expectLectureProgressSummary,
    expectProgressData,
    expectLectureProgressData,
    expectLastAccessedLecture,
    expectCompletedCourse,
};
