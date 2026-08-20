import { describe, it, expect } from "vitest";
import request from "supertest";

import "../setup/api.test.setup.js"

import app from "../../src/app.js";

import { ROLES } from "../../src/features/user/user.constants.js";
import { RESOURCE_STATUS } from "../../src/constants/resource.constants.js";
import { ORDER_CURRENCY, ORDER_STATUS } from "../../src/features/order/order.constants.js";
import { PAYMENT_STATUS } from "../../src/features/payment/payment.constants.js";

import { createAuthenticatedStudentAgent } from "../helpers/auth.helper.js";
import {
    createTestInstructor,
    createTestCourse,
    createTestSection,
    createTestLecture,
    createTestOrder,
    createTestPayment,
    createTestEnrollment
} from "../helpers/progress.helper.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("GET /health", () => {

    it("should return 200 for the health endpoint", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.status).toBe(200);
    });

});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("GET /unknown", () => {

    it("should return 404 for an unknown route", async () => {
        const response = await request(app)
            .get("/this-route-does-not-exist");

        expect(response.status).toBe(404);
    });

});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

it("should create an authenticated student agent", async () => {
    const { agent, user } = await createAuthenticatedStudentAgent();

    expect(agent).toBeDefined();
    expect(user).toBeDefined();
});

it("should create a test instructor", async () => {
    const instructor = await createTestInstructor();

    expect(instructor).toBeDefined();
    expect(instructor.role).toBe(ROLES.INSTRUCTOR);
});

it("should create a published test course", async () => {
    const instructor = await createTestInstructor();

    const course = await createTestCourse({ instructorId: instructor._id, });

    expect(course).toBeDefined();
    expect(course.instructor.toString()).toBe(instructor._id.toString());
    expect(course.status).toBe(RESOURCE_STATUS.PUBLISHED);
    expect(course.isDeleted).toBe(false);
});

it("should create a published test section", async () => {
    const instructor = await createTestInstructor()
    const course = await createTestCourse({ instructorId: instructor._id })

    const section = await createTestSection({ courseId: course._id })

    expect(section).toBeDefined()
    expect(section.course.toString()).toBe(course._id.toString())
    expect(section.status).toBe(RESOURCE_STATUS.PUBLISHED)
    expect(section.isDeleted).toBe(false)
})

it("should create a published test lecture with video data", async () => {
    const instructor = await createTestInstructor()
    const course = await createTestCourse({ instructorId: instructor._id })
    const section = await createTestSection({ courseId: course._id })

    const lecture = await createTestLecture({ sectionId: section._id })

    expect(lecture).toBeDefined()
    expect(lecture.section.toString()).toBe(section._id.toString())
    expect(lecture.video).not.toBeNull()
    expect(lecture.video.format).toBe("mp4")
    expect(lecture.status).toBe(RESOURCE_STATUS.PUBLISHED)
    expect(lecture.isDeleted).toBe(false)
})

it("should create a test order", async () => {
    const { user } = await createAuthenticatedStudentAgent();
    const instructor = await createTestInstructor();
    const course = await createTestCourse({
        instructorId: instructor._id,
    });

    const order = await createTestOrder({
        studentId: user._id,
        courseId: course._id,
        amount: course.price,
    });

    expect(order).toBeDefined();
    expect(order.course.toString()).toBe(course._id.toString());
    expect(order.student.toString()).toBe(user._id.toString());
    expect(order.amount).toBe(course.price);
    expect(order.status).toBe(ORDER_STATUS.COMPLETED);
    expect(order.currency).toBe(ORDER_CURRENCY);
});

it("should create a successful test payment", async () => {
    const { user } = await createAuthenticatedStudentAgent();
    const instructor = await createTestInstructor();
    const course = await createTestCourse({
        instructorId: instructor._id,
    });

    const order = await createTestOrder({
        studentId: user._id,
        courseId: course._id,
        amount: course.price,
    });

    const payment = await createTestPayment({
        orderId: order._id,
        studentId: user._id,
        amount: course.price,
    });

    expect(payment).toBeDefined();
    expect(payment.order.toString()).toBe(order._id.toString());
    expect(payment.student.toString()).toBe(user._id.toString());
    expect(payment.amount).toBe(course.price);
    expect(payment.status).toBe(PAYMENT_STATUS.SUCCESS);
    expect(payment.currency).toBe(ORDER_CURRENCY);
    expect(payment.providerPaymentId).toBeDefined();
});

it("should create a successful test enrollment", async () => {
    const { user } = await createAuthenticatedStudentAgent();
    const instructor = await createTestInstructor();
    const course = await createTestCourse({
        instructorId: instructor._id,
    });

    const order = await createTestOrder({
        studentId: user._id,
        courseId: course._id,
        amount: course.price,
    });

    const payment = await createTestPayment({
        orderId: order._id,
        studentId: user._id,
        amount: course.price,
    });

    const enrollment = await createTestEnrollment({
        studentId: user._id,
        courseId: course._id,
        orderId: order._id,
        paymentId: payment._id
    })

    expect(enrollment).toBeDefined()
    expect(enrollment.student.toString()).toBe(user._id.toString())
    expect(enrollment.course.toString()).toBe(course._id.toString())
    expect(enrollment.order.toString()).toBe(order._id.toString())
    expect(enrollment.payment.toString()).toBe(payment._id.toString())
    expect(enrollment.isDeleted).toBe(false)

});



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("GET /courses/:courseId", () => {

    it("should return 401 status when student is not authenticated", async () => {
        const response = await request(app)
            .get(
                "/api/v1/progress/students/courses/507f1f77bcf86cd799439011"
            );

        expect(response.status).toBe(401);
    });

});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("POST /courses/:courseId/lectures/:lectureId", () => {

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app)
            .post(
                "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012"
            );

        expect(response.status).toBe(401);
    });

});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("PATCH /courses/:courseId/lectures/:lectureId", () => {

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app)
            .patch(
                "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012"
            );

        expect(response.status).toBe(401);
    });

});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("PATCH /courses/:courseId/lectures/:lectureId", () => {

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app)
            .patch(
                "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012"
            );

        expect(response.status).toBe(401);
    });

});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

describe("POST /courses/:courseId/lectures/:lectureId/complete", () => {

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app)
            .post(
                "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012/complete"
            );

        expect(response.status).toBe(401);
    });

});

