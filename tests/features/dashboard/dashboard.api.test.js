import mongoose from "mongoose";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import "../../setup/api.test.setup.js";
import app from "../../../src/app.js";

import User from "../../../src/features/user/user.model.js";
import Course from "../../../src/features/course/course.model.js";
import Order from "../../../src/features/order/order.model.js";
import Payment from "../../../src/features/payment/payment.model.js";
import Enrollment from "../../../src/features/enrollment/enrollment.model.js";
import Progress from "../../../src/features/progress/progress.model.js";

import { DASHBOARD_ERROR_MESSAGES } from "../../../src/features/dashboard/dashboard.constants.js";

import { createAuthenticatedStudentAgent } from "../../helpers/auth.helper.js";
import {
    createTestDashboardInstructor,
    createTestDashboardStudent,
    createTestDashboardAdmin,
} from "../../helpers/dashboard.helper.js";

import {
    createInstructorDashboardScenario,
    createPopulatedInstructorDashboardScenario,
    createStudentDashboardScenario,
    createPopulatedStudentDashboardScenario,
    createAdminDashboardScenario,
    createPopulatedAdminDashboardScenario,
} from "../../fixtures/dashboard.fixture.js";

////////////////////////////////////////////////////////////////////////////////
// DASHBOARD TEST DATABASE CLEANUP
////////////////////////////////////////////////////////////////////////////////
//
// Dashboard queries calculate aggregate values across the database.
// Therefore every dashboard test must start with a clean database so data
// created by one test cannot affect the aggregate results of another test.

const clearDashboardTestDatabase = async () => {
    await Promise.all([
        User.deleteMany({}),
        Course.deleteMany({}),
        Order.deleteMany({}),
        Payment.deleteMany({}),
        Enrollment.deleteMany({}),
        Progress.deleteMany({}),
    ]);
};

beforeEach(async () => {
    await clearDashboardTestDatabase();
});

////////////////////////////////////////////////////////////////////////////////
// AUTHENTICATED DASHBOARD AGENT
////////////////////////////////////////////////////////////////////////////////
//
// Dashboard fixture users are created directly in the database.
// This helper authenticates those users through the normal login flow so
// instructor and admin requests contain the correct role in the access token.

const createAuthenticatedDashboardAgent = async ({ user }) => {
    const agent = request.agent(app);

    const response = await agent.post("/api/v1/auth/sessions").send({
        email: user.email,
        password: "TestPassword123!",
    });

    if (response.status !== 200) {
        throw new Error(
            `Failed to authenticate dashboard user: ${JSON.stringify(
                response.body
            )}`
        );
    }

    return agent;
};

////////////////////////////////////////////////////////////////////////////////
// INSTRUCTOR DASHBOARD
////////////////////////////////////////////////////////////////////////////////

describe("GET /api/v1/dashboard/instructors/:instructorId", () => {
    // Unauthenticated users must not be able to access the instructor dashboard.

    it("should return 401 when instructor is not authenticated", async () => {
        const instructorId = new mongoose.Types.ObjectId();

        const response = await request(app).get(
            `/api/v1/dashboard/instructors/${instructorId}`
        );

        expect(response.status).toBe(401);
    });

    // Invalid MongoDB IDs must be rejected by request validation.

    it("should return 400 when instructor ID is invalid", async () => {
        const { instructor } = await createInstructorDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await agent.get(
            "/api/v1/dashboard/instructors/invalid-instructor-id"
        );

        expect(response.status).toBe(400);
    });

    // An instructor must not be able to access another instructor's dashboard.

    it("should return 403 when instructor requests another instructor dashboard", async () => {
        const firstScenario = await createInstructorDashboardScenario();
        const secondScenario = await createInstructorDashboardScenario();

        const firstAgent = await createAuthenticatedDashboardAgent({
            user: firstScenario.instructor,
        });

        const response = await firstAgent.get(
            `/api/v1/dashboard/instructors/${secondScenario.instructor._id}`
        );

        expect(response.status).toBe(403);

        expect(response.body.message).toBe(
            DASHBOARD_ERROR_MESSAGES.INSTRUCTOR_DASHBOARD_ACCESS_DENIED
        );
    });

    // Students must not be able to access instructor dashboards because
    // instructor dashboard access requires instructor or admin role.

    it("should return 403 when student tries to access instructor dashboard", async () => {
        const { instructor } = await createInstructorDashboardScenario();

        const { agent } = await createAuthenticatedStudentAgent();

        const response = await agent.get(
            `/api/v1/dashboard/instructors/${instructor._id}`
        );

        expect(response.status).toBe(403);
    });

    // An authenticated instructor should receive an empty dashboard when
    // no courses, enrollments, or payments exist.

    it("should return empty dashboard statistics when instructor has no courses", async () => {
        const { instructor } = await createInstructorDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await agent.get(
            `/api/v1/dashboard/instructors/${instructor._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.data).toEqual({
            totalPublishedCourses: 0,
            totalDraftCourses: 0,
            totalDeletedCourses: 0,
            totalEnrollments: 0,
            totalRevenue: 0,
        });
    });

    // Instructor dashboard must correctly count published, draft,
    // and deleted courses.

    it("should return correct course statistics", async () => {
        const { instructor, publishedCourse, draftCourse, deletedCourse } =
            await createPopulatedInstructorDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await agent.get(
            `/api/v1/dashboard/instructors/${instructor._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data).toBeDefined();

        expect(response.body.data.totalPublishedCourses).toBe(1);
        expect(response.body.data.totalDraftCourses).toBe(1);
        expect(response.body.data.totalDeletedCourses).toBe(1);

        expect(publishedCourse.isDeleted).toBe(false);
        expect(draftCourse.isDeleted).toBe(false);
        expect(deletedCourse.isDeleted).toBe(true);
    });

    // Enrollments from both active and deleted courses are retained in
    // instructor historical enrollment statistics.

    it("should return correct total enrollment count", async () => {
        const { instructor } =
            await createPopulatedInstructorDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await agent.get(
            `/api/v1/dashboard/instructors/${instructor._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalEnrollments).toBe(2);
    });

    // Instructor revenue is calculated from successful payments associated
    // with the instructor's courses.

    it("should return correct total revenue from successful payments", async () => {
        const { instructor, publishedCourse, deletedCourse } =
            await createPopulatedInstructorDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await agent.get(
            `/api/v1/dashboard/instructors/${instructor._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalRevenue).toBe(
            publishedCourse.price + deletedCourse.price
        );
    });

    // The complete populated instructor dashboard should contain all
    // calculated statistics together.

    it("should return the complete instructor dashboard", async () => {
        const { instructor, publishedCourse, draftCourse, deletedCourse } =
            await createPopulatedInstructorDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await agent.get(
            `/api/v1/dashboard/instructors/${instructor._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toEqual({
            totalPublishedCourses: 1,
            totalDraftCourses: 1,
            totalDeletedCourses: 1,
            totalEnrollments: 2,
            totalRevenue: publishedCourse.price + deletedCourse.price,
        });

        expect(draftCourse.status).toBeDefined();
    });
});

////////////////////////////////////////////////////////////////////////////////
// STUDENT DASHBOARD
////////////////////////////////////////////////////////////////////////////////

describe("GET /api/v1/dashboard/students/:studentId", () => {
    // Unauthenticated users must not be able to access the student dashboard.

    it("should return 401 when student is not authenticated", async () => {
        const studentId = new mongoose.Types.ObjectId();

        const response = await request(app).get(
            `/api/v1/dashboard/students/${studentId}`
        );

        expect(response.status).toBe(401);
    });

    // Invalid MongoDB IDs must be rejected by request validation.

    it("should return 400 when student ID is invalid", async () => {
        const { agent } = await createStudentDashboardScenario();

        const response = await agent.get(
            "/api/v1/dashboard/students/invalid-student-id"
        );

        expect(response.status).toBe(400);
    });

    // A student must not be able to access another user's student dashboard.

    it("should return 403 when student requests another student's dashboard", async () => {
        const firstScenario = await createStudentDashboardScenario();
        const secondScenario = await createStudentDashboardScenario();

        const response = await firstScenario.agent.get(
            `/api/v1/dashboard/students/${secondScenario.user._id}`
        );

        expect(response.status).toBe(403);

        expect(response.body.message).toBe(
            DASHBOARD_ERROR_MESSAGES.STUDENT_DASHBOARD_ACCESS_DENIED
        );
    });

    // An instructor can access their own student dashboard because every
    // authenticated user can have student enrollment activity.

    it("should allow instructor to access their own student dashboard", async () => {
        const instructor = await createTestDashboardInstructor({
            username: "Dashboard Instructor",
        });

        const instructorAgent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await instructorAgent.get(
            `/api/v1/dashboard/students/${instructor._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toEqual({
            totalEnrolledCourses: 0,
            totalCompletedCourses: 0,
        });
    });

    // An instructor must not be able to access another user's student dashboard.

    it("should return 403 when instructor requests another user's student dashboard", async () => {
        const instructor = await createTestDashboardInstructor({
            username: "Dashboard Instructor",
        });

        const student = await createTestDashboardStudent({
            username: "Dashboard Student",
        });

        const instructorAgent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await instructorAgent.get(
            `/api/v1/dashboard/students/${student._id}`
        );

        expect(response.status).toBe(403);

        expect(response.body.message).toBe(
            DASHBOARD_ERROR_MESSAGES.STUDENT_DASHBOARD_ACCESS_DENIED
        );
    });

    // An admin can access their own student dashboard because every
    // authenticated user can have student enrollment activity.

    it("should allow admin to access their own student dashboard", async () => {
        const admin = await createTestDashboardAdmin({
            username: "Dashboard Admin",
        });

        const adminAgent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await adminAgent.get(
            `/api/v1/dashboard/students/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toEqual({
            totalEnrolledCourses: 0,
            totalCompletedCourses: 0,
        });
    });

    // An admin must not be able to access another user's student dashboard.

    it("should return 403 when admin requests another user's student dashboard", async () => {
        const admin = await createTestDashboardAdmin({
            username: "Dashboard Admin",
        });

        const student = await createTestDashboardStudent({
            username: "Dashboard Student",
        });

        const adminAgent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await adminAgent.get(
            `/api/v1/dashboard/students/${student._id}`
        );

        expect(response.status).toBe(403);

        expect(response.body.message).toBe(
            DASHBOARD_ERROR_MESSAGES.STUDENT_DASHBOARD_ACCESS_DENIED
        );
    });

    // An authenticated student with no enrollments should receive zero
    // dashboard statistics.

    it("should return empty dashboard statistics when student has no enrollments", async () => {
        const { agent, user } = await createStudentDashboardScenario();

        const response = await agent.get(
            `/api/v1/dashboard/students/${user._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.data).toEqual({
            totalEnrolledCourses: 0,
            totalCompletedCourses: 0,
        });
    });

    // The dashboard should count every non-deleted enrollment belonging
    // to the authenticated student.

    it("should return correct total enrolled course count", async () => {
        const { agent, user } = await createPopulatedStudentDashboardScenario();

        const response = await agent.get(
            `/api/v1/dashboard/students/${user._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalEnrolledCourses).toBe(2);
    });

    // Only completed progress records should contribute to the completed
    // course count.

    it("should return correct total completed course count", async () => {
        const { agent, user } = await createPopulatedStudentDashboardScenario();

        const response = await agent.get(
            `/api/v1/dashboard/students/${user._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalCompletedCourses).toBe(1);
    });

    // An enrolled course without completed progress must not increase
    // the completed-course count.

    it("should not count an enrolled course as completed without completed progress", async () => {
        const { agent, user } = await createPopulatedStudentDashboardScenario();

        const response = await agent.get(
            `/api/v1/dashboard/students/${user._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalEnrolledCourses).toBe(2);
        expect(response.body.data.totalCompletedCourses).toBe(1);
    });

    // The populated student dashboard should return the expected
    // aggregate values together.

    it("should return the complete student dashboard", async () => {
        const { agent, user } = await createPopulatedStudentDashboardScenario();

        const response = await agent.get(
            `/api/v1/dashboard/students/${user._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toEqual({
            totalEnrolledCourses: 2,
            totalCompletedCourses: 1,
        });
    });
});

////////////////////////////////////////////////////////////////////////////////
// ADMIN DASHBOARD
////////////////////////////////////////////////////////////////////////////////

describe("GET /api/v1/dashboard/admins/:adminId", () => {
    // Unauthenticated users must not be able to access the admin dashboard.

    it("should return 401 when admin is not authenticated", async () => {
        const adminId = new mongoose.Types.ObjectId();

        const response = await request(app).get(
            `/api/v1/dashboard/admins/${adminId}`
        );

        expect(response.status).toBe(401);
    });

    // Invalid MongoDB IDs must be rejected by request validation.

    it("should return 400 when admin ID is invalid", async () => {
        const { admin } = await createAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            "/api/v1/dashboard/admins/invalid-admin-id"
        );

        expect(response.status).toBe(400);
    });

    // An admin must not be able to access another admin's dashboard.

    it("should return 403 when admin requests another admin dashboard", async () => {
        const firstScenario = await createAdminDashboardScenario();
        const secondScenario = await createAdminDashboardScenario();

        const firstAgent = await createAuthenticatedDashboardAgent({
            user: firstScenario.admin,
        });

        const response = await firstAgent.get(
            `/api/v1/dashboard/admins/${secondScenario.admin._id}`
        );

        expect(response.status).toBe(403);

        expect(response.body.message).toBe(
            DASHBOARD_ERROR_MESSAGES.ADMIN_DASHBOARD_ACCESS_DENIED
        );
    });

    // Students must not be able to access the admin dashboard.

    it("should return 403 when student tries to access admin dashboard", async () => {
        const { admin } = await createAdminDashboardScenario();

        const { agent } = await createAuthenticatedStudentAgent();

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(403);
    });

    // Instructors must not be able to access the admin dashboard.

    it("should return 403 when instructor tries to access admin dashboard", async () => {
        const { admin } = await createAdminDashboardScenario();

        const instructor = await createTestDashboardInstructor({
            username: "Dashboard Instructor",
        });

        const instructorAgent = await createAuthenticatedDashboardAgent({
            user: instructor,
        });

        const response = await instructorAgent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(403);
    });

    // An admin with no dashboard data should receive zero counts and
    // empty arrays.

    it("should return empty dashboard statistics when no admin data exists", async () => {
        const { admin } = await createAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.data).toEqual({
            totalEnrollments: 0,
            totalInstructors: 0,
            instructors: [],
            totalStudents: 0,
            students: [],
            totalRevenue: 0,
            totalCourses: 0,
            courses: [],
            totalRemovedCourses: 0,
            removedCourses: [],
            draftCourses: [],
            publishedCourses: [],
        });
    });

    // Only active instructors should contribute to the instructor count
    // and instructor list.

    it("should return only active instructors", async () => {
        const { admin, instructorOne, instructorTwo, inactiveInstructor } =
            await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalInstructors).toBe(2);

        expect(response.body.data.instructors).toHaveLength(2);

        const instructorNames = response.body.data.instructors.map(
            (instructor) => instructor.name
        );

        expect(instructorNames).toContain(instructorOne.username);
        expect(instructorNames).toContain(instructorTwo.username);
        expect(instructorNames).not.toContain(inactiveInstructor.username);
    });

    // Only active students should contribute to the student count
    // and student list.

    it("should return only active students", async () => {
        const { admin, studentOne, studentTwo, inactiveStudent } =
            await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalStudents).toBe(2);

        expect(response.body.data.students).toHaveLength(2);

        const studentNames = response.body.data.students.map(
            (student) => student.name
        );

        expect(studentNames).toContain(studentOne.username);
        expect(studentNames).toContain(studentTwo.username);
        expect(studentNames).not.toContain(inactiveStudent.username);
    });

    // Admin enrollment statistics should count non-deleted enrollments.

    it("should return correct total enrollment count", async () => {
        const { admin } = await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalEnrollments).toBe(3);
    });

    // Admin revenue should be calculated from successful payments.

    it("should return correct total revenue", async () => {
        const { admin, publishedCourse, secondPublishedCourse, removedCourse } =
            await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalRevenue).toBe(
            publishedCourse.price +
                secondPublishedCourse.price +
                removedCourse.price
        );
    });

    // Active courses should exclude deleted courses regardless of their
    // resource status.

    it("should return correct active course statistics", async () => {
        const {
            admin,
            publishedCourse,
            secondPublishedCourse,
            draftCourse,
            removedCourse,
        } = await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalCourses).toBe(3);
        expect(response.body.data.totalRemovedCourses).toBe(1);

        const courseIds = response.body.data.courses.map((course) =>
            course._id.toString()
        );

        expect(courseIds).toEqual(
            expect.arrayContaining([
                publishedCourse._id.toString(),
                secondPublishedCourse._id.toString(),
                draftCourse._id.toString(),
            ])
        );

        expect(courseIds).not.toContain(removedCourse._id.toString());
    });

    // Removed courses should appear separately from active courses.

    it("should return removed course statistics", async () => {
        const { admin, removedCourse } =
            await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.totalRemovedCourses).toBe(1);
        expect(response.body.data.removedCourses).toHaveLength(1);

        expect(response.body.data.removedCourses[0].title).toBe(
            removedCourse.title
        );

        expect(response.body.data.removedCourses[0].subtitle).toBe(
            removedCourse.subtitle
        );
    });

    // Draft courses should appear in the draft course list.

    it("should return draft courses", async () => {
        const { admin, draftCourse, instructorOne } =
            await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.draftCourses).toHaveLength(1);

        expect(response.body.data.draftCourses[0].title).toBe(
            draftCourse.title
        );

        expect(response.body.data.draftCourses[0].instructor).toBe(
            instructorOne.username
        );
    });

    // Published courses should appear in the published course list.

    it("should return published courses", async () => {
        const {
            admin,
            publishedCourse,
            secondPublishedCourse,
            instructorOne,
            instructorTwo,
        } = await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.data.publishedCourses).toHaveLength(2);

        const publishedTitles = response.body.data.publishedCourses.map(
            (course) => course.title
        );

        expect(publishedTitles).toContain(publishedCourse.title);
        expect(publishedTitles).toContain(secondPublishedCourse.title);

        const publishedInstructorNames =
            response.body.data.publishedCourses.map(
                (course) => course.instructor
            );

        expect(publishedInstructorNames).toContain(instructorOne.username);

        expect(publishedInstructorNames).toContain(instructorTwo.username);
    });

    // The complete populated admin dashboard should contain all aggregate
    // counts and dashboard lists.

    it("should return the complete admin dashboard", async () => {
        const {
            admin,
            publishedCourse,
            secondPublishedCourse,
            draftCourse,
            removedCourse,
            instructorOne,
            instructorTwo,
            studentOne,
            studentTwo,
        } = await createPopulatedAdminDashboardScenario();

        const agent = await createAuthenticatedDashboardAgent({
            user: admin,
        });

        const response = await agent.get(
            `/api/v1/dashboard/admins/${admin._id}`
        );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.data.totalEnrollments).toBe(3);

        expect(response.body.data.totalInstructors).toBe(2);
        expect(response.body.data.instructors).toHaveLength(2);

        const instructorNames = response.body.data.instructors.map(
            (instructor) => instructor.name
        );

        expect(instructorNames).toEqual(
            expect.arrayContaining([
                instructorOne.username,
                instructorTwo.username,
            ])
        );

        expect(response.body.data.totalStudents).toBe(2);
        expect(response.body.data.students).toHaveLength(2);

        const studentNames = response.body.data.students.map(
            (student) => student.name
        );

        expect(studentNames).toEqual(
            expect.arrayContaining([studentOne.username, studentTwo.username])
        );

        expect(response.body.data.totalRevenue).toBe(
            publishedCourse.price +
                secondPublishedCourse.price +
                removedCourse.price
        );

        expect(response.body.data.totalCourses).toBe(3);
        expect(response.body.data.courses).toHaveLength(3);

        const courseIds = response.body.data.courses.map((course) =>
            course._id.toString()
        );

        expect(courseIds).toEqual(
            expect.arrayContaining([
                publishedCourse._id.toString(),
                secondPublishedCourse._id.toString(),
                draftCourse._id.toString(),
            ])
        );

        expect(courseIds).not.toContain(removedCourse._id.toString());

        expect(response.body.data.totalRemovedCourses).toBe(1);
        expect(response.body.data.removedCourses).toHaveLength(1);

        expect(response.body.data.draftCourses).toHaveLength(1);
        expect(response.body.data.publishedCourses).toHaveLength(2);

        const publishedInstructorNames =
            response.body.data.publishedCourses.map(
                (course) => course.instructor
            );

        expect(publishedInstructorNames).toContain(instructorOne.username);

        expect(publishedInstructorNames).toContain(instructorTwo.username);
    });
});
