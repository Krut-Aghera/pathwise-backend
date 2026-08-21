import mongoose from "mongoose";
import request from "supertest";
import { it, expect, describe } from "vitest";

import "../../setup/api.test.setup.js";
import app from "../../../src/app.js";

import {
    PROGRESS_ERROR_MESSAGES,
    PROGRESS_STATUS,
} from "../../../src/features/progress/progress.constants.js";

import {
    createEnrolledCourseScenario,
    createCourseProgressScenario,
    createInitializedLectureProgressScenario,
    createCompletedLectureProgressScenario,
} from "../../fixtures/progress.fixtures.js";

import { createTestCourse } from "../../helpers/course.helper.js";
import { createTestSection } from "../../helpers/section.helper.js";
import { createTestLecture } from "../../helpers/lecture.helper.js";
import { makeTestLectureProgressExists } from "../../helpers/progress.helper.js";




////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("GET /api/v1/progress/students/courses/:courseId", () => {
    // This test is to ensure that if the student is not authenticated,
    // the API should return a 401 status code.

    it("should return 401 status when student is not authenticated", async () => {
        const response = await request(app).get(
            "/api/v1/progress/students/courses/507f1f77bcf86cd799439011"
        );

        expect(response.status).toBe(401);
    });

    // This test is to ensure that if the course progress does not exist for the student,
    // it should initialize the course progress and return it.

    it("should fetch and initialize course progress for an enrolled student", async () => {
        const {
            agent,
            course,
            lectures: [lecture],
        } = await createEnrolledCourseScenario();

        const response = await agent.get(
            `/api/v1/progress/students/courses/${course._id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.meta.course.totalLectures).toBe(1);
        expect(response.body.meta.course.completedLectures).toBe(0);
        expect(response.body.meta.course.totalDuration).toBe(
            lecture.video.duration
        );
        expect(response.body.meta.course.totalCompletedDuration).toBe(0);
        expect(response.body.meta.course.progressPercentage).toBe(0);

        expect(response.body.meta.lectures).toHaveLength(1);

        expect(response.body.meta.lectures[0].lectureId.toString()).toBe(
            lecture._id.toString()
        );

        expect(response.body.meta.lectures[0].progressPercentage).toBe(0);
    });

    // This test is to ensure that if the course progress already exists for the student,
    // it should fetch the existing progress instead of creating a new one.

    it("should fetch existing course progress for an enrolled student", async () => {
        const { agent, course, lecture } =
            await createInitializedLectureProgressScenario({
                watchedDuration: 500,
                isCompleted: false,
            });

        const response = await agent.get(
            `/api/v1/progress/students/courses/${course._id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.meta.course.totalLectures).toBe(1);
        expect(response.body.meta.course.completedLectures).toBe(0);
        expect(response.body.meta.course.totalCompletedDuration).toBe(0);
        expect(response.body.meta.course.progressPercentage).toBe(0);
        expect(response.body.meta.course.totalDuration).toBe(
            lecture.video.duration
        );

        expect(response.body.meta.lectures).toHaveLength(1);

        expect(response.body.meta.lectures[0].lectureId.toString()).toBe(
            lecture._id.toString()
        );

        expect(response.body.meta.lectures[0].progressPercentage).toBe(
            83.33333333333334
        );
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("POST /courses/:courseId/lectures/:lectureId", () => {
    // This test is to ensure that if the student is not authenticated,
    // the API should return a 401 status code.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app).post(
            "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012"
        );

        expect(response.status).toBe(401);
    });

    // This test is to ensure that if the student is enrolled in a course and accesses a lecture for the first time,
    // the lecture progress should be initialized and returned.

    it("should initialize lecture progress for an enrolled student", async () => {
        const { agent, user, course, lectures } =
            await createCourseProgressScenario();

        const lecture = lectures[0];

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.data.course.toString()).toBe(
            course._id.toString()
        );

        expect(response.body.data.student.toString()).toBe(user._id.toString());

        expect(response.body.data.status).toBe(PROGRESS_STATUS.IN_PROGRESS);

        expect(response.body.data.lectures[0].lecture.toString()).toBe(
            lecture._id.toString()
        );

        expect(response.body.data.lectures[0].lastPosition).toBe(0);

        expect(response.body.data.lectures[0].watchedDuration).toBe(0);

        expect(response.body.data.lectures[0].isCompleted).toBe(false);

        expect(response.body.meta.course.totalLectures).toBe(1);

        expect(response.body.meta.course.completedLectures).toBe(0);

        expect(response.body.meta.course.totalCompletedDuration).toBe(0);

        expect(response.body.meta.course.progressPercentage).toBe(0);

        expect(response.body.meta.lectures).toHaveLength(1);

        expect(response.body.meta.lectures[0].progressPercentage).toBe(0);

        expect(response.body.meta.lectures[0].lectureId.toString()).toBe(
            lecture._id.toString()
        );
    });

    // This test is to ensure that if the requested course does not have progress for the student,
    // the API should return a 404 status code.

    it("should return 404 when course progress is not found", async () => {
        const { agent, instructor, lectures } =
            await createCourseProgressScenario();

        const lecture = lectures[0];

        const anotherCourse = await createTestCourse({
            instructorId: instructor._id,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${anotherCourse._id}/lectures/${lecture._id}`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the requested lecture does not exist,
    // the API should return a 404 status code.

    it("should return 404 when lecture is not found", async () => {
        const { agent, course } = await createCourseProgressScenario();

        const nonExistingLectureId = new mongoose.Types.ObjectId();

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${nonExistingLectureId}`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the requested lecture belongs to a different course,
    // the API should return a 404 status code.

    it("should return 404 when lecture belongs to another course", async () => {
        const {
            agent,
            instructor,
            course: requestedCourse,
        } = await createCourseProgressScenario();

        const lectureCourse = await createTestCourse({
            instructorId: instructor._id,
        });

        const section = await createTestSection({
            courseId: lectureCourse._id,
        });

        const lecture = await createTestLecture({
            sectionId: section._id,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${requestedCourse._id}/lectures/${lecture._id}`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the lecture progress already exists for the student,
    // the API should update the last accessed lecture instead of creating duplicate lecture progress.

    it("should update last accessed lecture when lecture progress is already initialized", async () => {
        const { agent, course, lecture } =
            await createInitializedLectureProgressScenario();

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data.lastAccessedLecture.toString()).toBe(
            lecture._id.toString()
        );

        expect(response.body.data.lectures[0].lecture.toString()).toBe(
            lecture._id.toString()
        );

        expect(response.body.data.lectures[0].lastPosition).toBe(100);

        expect(response.body.data.lectures[0].watchedDuration).toBe(110);

        expect(response.body.data.lectures[0].isCompleted).toBe(false);

        expect(response.body.meta.course.totalDuration).toBe(
            lecture.video.duration
        );

        expect(response.body.meta.course.progressPercentage).toBe(0);
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("PATCH /courses/:courseId/lectures/:lectureId", () => {
    // This test is to ensure that if the student is not authenticated,
    // the API should return a 401 status code.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app).patch(
            "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012"
        );

        expect(response.status).toBe(401);
    });

    // This test is to ensure that if the student is enrolled in a course but course progress does not exist,
    // the API should return a 404 status code.

    it("should return 404 when course progress is not found", async () => {
        const { agent, course, lecture } = await createEnrolledCourseScenario();

        const response = await agent
            .patch(
                `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}`
            )
            .send({
                lastPosition: 100,
                watchedDuration: 110,
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if course progress exists but lecture progress has not been initialized,
    // the API should return a 404 status code.

    it("should return 404 when lecture progress is not initialized", async () => {
        const { agent, course, lecture } = await createCourseProgressScenario();

        const response = await agent
            .patch(
                `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}`
            )
            .send({
                lastPosition: 100,
                watchedDuration: 110,
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the requested lecture does not exist,
    // the API should return a 404 status code.

    it("should return 404 when lecture is not found", async () => {
        const { agent, course } = await createCourseProgressScenario();

        const nonExistingLectureId = new mongoose.Types.ObjectId();

        const response = await agent
            .patch(
                `/api/v1/progress/students/courses/${course._id}/lectures/${nonExistingLectureId}`
            )
            .send({
                lastPosition: 100,
                watchedDuration: 110,
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the student has course progress for one course but requests a lecture from another course,
    // the API should return a 404 status code.

    it("should return 404 when lecture belongs to another course", async () => {
        const {
            agent,
            instructor,
            course: courseA,
        } = await createCourseProgressScenario();

        const courseB = await createTestCourse({
            instructorId: instructor._id,
        });

        const sectionB = await createTestSection({
            courseId: courseB._id,
        });

        const lectureB = await createTestLecture({
            sectionId: sectionB._id,
        });

        const response = await agent
            .patch(
                `/api/v1/progress/students/courses/${courseB._id}/lectures/${lectureB._id}`
            )
            .send({
                lastPosition: 100,
                watchedDuration: 110,
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if lecture progress is already initialized,
    // the API should successfully update the lecture position and watched duration.

    it("should successfully update lecture progress", async () => {
        const { agent, course, lecture } =
            await createInitializedLectureProgressScenario();

        const response = await agent
            .patch(
                `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}`
            )
            .send({
                lastPosition: 300,
                watchedDuration: 300,
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        const lectureProgress = response.body.data.lectures[0];

        expect(lectureProgress.lecture.toString()).toBe(lecture._id.toString());

        expect(lectureProgress.lastPosition).toBe(300);
        expect(lectureProgress.watchedDuration).toBe(300);
        expect(lectureProgress.isCompleted).toBe(false);

        expect(response.body.meta.lectures).toHaveLength(1);

        expect(response.body.meta.lectures[0].lectureId.toString()).toBe(
            lecture._id.toString()
        );

        expect(response.body.meta.lectures[0].progressPercentage).toBe(50);

        expect(response.body.meta.course.totalLectures).toBe(1);

        expect(response.body.meta.course.completedLectures).toBe(0);

        expect(response.body.meta.course.totalCompletedDuration).toBe(0);

        expect(response.body.meta.course.progressPercentage).toBe(0);
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("POST /courses/:courseId/lectures/:lectureId/complete", () => {
    // This test is to ensure that if the student is not authenticated,
    // the API should return a 401 status code.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app).post(
            "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012/complete"
        );

        expect(response.status).toBe(401);
    });

    // This test is to ensure that if course progress does not exist for the student,
    // the API should return a 404 status code.

    it("should return 404 when course progress is not found", async () => {
        const { agent, course, lecture } = await createEnrolledCourseScenario();

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if course progress exists but lecture progress has not been initialized,
    // the API should return a 404 status code.

    it("should return 404 when lecture progress is not initialized", async () => {
        const { agent, course, lecture } = await createCourseProgressScenario();

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the requested lecture does not exist,
    // the API should return a 404 status code.

    it("should return 404 when lecture is not found", async () => {
        const { agent, user, course } = await createCourseProgressScenario();

        const fakeLectureId = new mongoose.Types.ObjectId();

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: fakeLectureId,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${fakeLectureId}/complete`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the requested lecture belongs to a different course,
    // the API should return a 404 status code.

    it("should return 404 when lecture belongs to another course", async () => {
        const {
            agent,
            user,
            instructor,
            course: requestedCourse,
        } = await createCourseProgressScenario();

        const anotherCourse = await createTestCourse({
            instructorId: instructor._id,
        });

        const section = await createTestSection({
            courseId: anotherCourse._id,
        });

        const lecture = await createTestLecture({
            sectionId: section._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: requestedCourse._id,
            lectureId: lecture._id,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${requestedCourse._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the lecture has not reached the required completion threshold,
    // the API should return a 400 status code with the appropriate error message.

    it("should return 400 when lecture has not reached completion threshold", async () => {
        const { agent, course, lecture } =
            await createInitializedLectureProgressScenario();

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            PROGRESS_ERROR_MESSAGES.LECTURE_NOT_COMPLETED
        );
    });

    // This test is to ensure that if the lecture has reached the completion threshold,
    // the API should mark the lecture as completed and update the course progress.

    it("should complete lecture and update course progress", async () => {
        const { agent, course, lecture } =
            await createInitializedLectureProgressScenario({
                lastPosition: 540,
                watchedDuration: 540,
                isCompleted: false,
            });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        const lectureProgress = response.body.data.lectures[0];

        expect(lectureProgress.lecture.toString()).toBe(lecture._id.toString());

        expect(lectureProgress.lastPosition).toBe(540);

        expect(lectureProgress.watchedDuration).toBe(540);

        expect(lectureProgress.isCompleted).toBe(true);

        expect(response.body.meta.course.totalLectures).toBe(1);

        expect(response.body.meta.course.completedLectures).toBe(1);

        expect(response.body.meta.course.progressPercentage).toBe(100);

        expect(response.body.meta.lectures).toHaveLength(1);

        expect(response.body.meta.lectures[0].lectureId.toString()).toBe(
            lecture._id.toString()
        );

        expect(response.body.meta.lectures[0].progressPercentage).toBe(90);
    });

    // This test is to ensure that if the lecture is below the completion threshold,
    // the API should not complete the lecture and should return a 400 status code.

    it("should return 400 when lecture completion threshold is not reached", async () => {
        const { agent, course, lecture } =
            await createInitializedLectureProgressScenario({
                lastPosition: 500,
                watchedDuration: 500,
                isCompleted: false,
            });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    // This test is to ensure that if the lecture has reached exactly the required completion threshold,
    // the API should complete the lecture successfully.

    it("should complete lecture when completion threshold is exactly reached", async () => {
        const { agent, course, lecture } =
            await createInitializedLectureProgressScenario({
                lastPosition: 540,
                watchedDuration: 540,
                isCompleted: false,
            });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const lectureProgress = response.body.data.lectures[0];

        expect(lectureProgress.watchedDuration).toBe(540);
        expect(lectureProgress.lastPosition).toBe(540);
        expect(lectureProgress.isCompleted).toBe(true);

        expect(response.body.meta.course.completedLectures).toBe(1);
        expect(response.body.meta.course.progressPercentage).toBe(100);

        expect(response.body.meta.lectures[0].progressPercentage).toBe(90);
    });

    // This test is to ensure that if the lecture has already been completed,
    // the API should return the existing completed progress without creating duplicate progress.

    it("should return existing progress when lecture is already completed", async () => {
        const { agent, course, lecture } =
            await createCompletedLectureProgressScenario();

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const lectureProgress = response.body.data.lectures[0];

        expect(lectureProgress.lecture.toString()).toBe(lecture._id.toString());

        expect(lectureProgress.lastPosition).toBe(lecture.video.duration);

        expect(lectureProgress.watchedDuration).toBe(lecture.video.duration);

        expect(lectureProgress.isCompleted).toBe(true);

        expect(response.body.meta.course.totalLectures).toBe(1);

        expect(response.body.meta.course.completedLectures).toBe(1);

        expect(response.body.meta.course.progressPercentage).toBe(100);

        expect(response.body.meta.lectures[0].progressPercentage).toBe(100);
    });

    // This test is to ensure that if the final lecture in the course is completed,
    // the overall course progress should reach 100% and the course should be marked as completed.

    it("should complete the course when the final lecture is completed", async () => {
        const { agent, user, course, lectures } =
            await createCourseProgressScenario({
                lectureCount: 2,
                sectionCount: 2,
            });

        const firstLecture = lectures[0];
        const secondLecture = lectures[1];

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: firstLecture._id,
            lastPosition: firstLecture.video.duration,
            watchedDuration: firstLecture.video.duration,
            isCompleted: true,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: secondLecture._id,
            lastPosition: secondLecture.video.duration,
            watchedDuration: secondLecture.video.duration,
            isCompleted: false,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${secondLecture._id}/complete`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        const secondLectureProgress = response.body.data.lectures.find(
            ({ lecture }) => lecture.toString() === secondLecture._id.toString()
        );

        expect(secondLectureProgress.isCompleted).toBe(true);

        expect(response.body.meta.course.totalLectures).toBe(2);
        expect(response.body.meta.course.completedLectures).toBe(2);
        expect(response.body.meta.course.progressPercentage).toBe(100);

        expect(response.body.meta.lectures).toHaveLength(2);

        expect(
            response.body.meta.lectures.every(
                ({ progressPercentage }) => progressPercentage === 100
            )
        ).toBe(true);

        expect(response.body.data.status).toBe(PROGRESS_STATUS.COMPLETED);

        expect(response.body.data.completedAt).toBeDefined();
        expect(response.body.data.completedAt).not.toBeNull();
    });
});
