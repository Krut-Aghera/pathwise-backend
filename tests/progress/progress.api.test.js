import mongoose from "mongoose";
import request from "supertest";
import { describe, it, expect } from "vitest";

import "../setup/api.test.setup.js"

import app from "../../src/app.js";

import { ROLES } from "../../src/features/user/user.constants.js";
import { RESOURCE_STATUS } from "../../src/constants/resource.constants.js";
import { ORDER_CURRENCY, ORDER_STATUS } from "../../src/features/order/order.constants.js";
import { PAYMENT_STATUS } from "../../src/features/payment/payment.constants.js";
import { PROGRESS_ERROR_MESSAGES, PROGRESS_STATUS } from "../../src/features/progress/progress.constants.js";

import { createAuthenticatedStudentAgent } from "../helpers/auth.helper.js";
import {
    createTestInstructor,
    createTestCourse,
    createTestSection,
    createTestLecture,
    createTestOrder,
    createTestPayment,
    createTestEnrollment,
    fetchTestProgress,
    createTestProgress,
    makeTestLectureProgressExists
} from "../helpers/progress.helper.js";

/*

PROGRESS API TESTS
│
├── Fetch course progress
│   ├── 401 unauthenticated
│   ├── initialize course progress
│   └── fetch existing course progress
│
├── Initialize lecture progress
│   ├── 401 unauthenticated
│   ├── initialize lecture progress
│   ├── course progress not found → 404
│   ├── lecture not found → 404
│   ├── lecture belongs to another course → 404
│   └── existing lecture progress → update last accessed
│
├── Update lecture progress
│   ├── 401 unauthenticated
│   ├── course progress not found → 404
│   ├── lecture not found → 404
│   ├── lecture belongs to another course → 404
│   ├── lecture progress not initialized → 404
│   └── update progress successfully
│
└── Complete lecture
    ├── 401 unauthenticated
    ├── 404 cases
    ├── completion threshold validation
    ├── complete lecture
    └── complete entire course when final lecture is completed

*/

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

describe("GET /api/v1/progress/students/courses/:courseId", () => {

    it("should return 401 status when student is not authenticated", async () => {
        const response = await request(app)
            .get(
                "/api/v1/progress/students/courses/507f1f77bcf86cd799439011"
            );

        expect(response.status).toBe(401);
    });


    it("should fetch and initialize course progress for an enrolled student", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id });
        const section = await createTestSection({ courseId: course._id })
        const lecture = await createTestLecture({ sectionId: section._id })

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
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
        expect(response.body.meta.course.totalDuration).toBe(lecture.video.duration);
        expect(response.body.meta.course.totalCompletedDuration).toBe(0);
        expect(response.body.meta.course.progressPercentage).toBe(0);

        expect(response.body.meta.lectures).toHaveLength(1);
        expect(response.body.meta.lectures[0].lectureId.toString()).toBe(lecture._id.toString());
        expect(response.body.meta.lectures[0].progressPercentage).toBe(0);
    })

    it("should fetch existing course progress for an enrolled student", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id });
        const section = await createTestSection({ courseId: course._id })
        const lecture = await createTestLecture({ sectionId: section._id })

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await fetchTestProgress({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
            watchedDuration: 500,
            isCompleted: false
        })

        const response = await agent.get(
            `/api/v1/progress/students/courses/${course._id}`
        )

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)

        expect(response.body.data).toBeDefined()
        expect(response.body.meta).toBeDefined()

        expect(response.body.meta.course.totalLectures).toBe(1);
        expect(response.body.meta.course.completedLectures).toBe(0);
        expect(response.body.meta.course.totalCompletedDuration).toBe(0);
        expect(response.body.meta.course.progressPercentage).toBe(0);
        expect(response.body.meta.course.totalDuration).toBe(lecture.video.duration);
        expect(response.body.meta.lectures).toHaveLength(1);
        expect(response.body.meta.lectures[0].lectureId.toString()).toBe(lecture._id.toString());
        expect(response.body.meta.lectures[0].progressPercentage).toBe(83.33333333333334);
    })

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

    it("should initialize lecture progress for an enrolled student", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id });
        const section = await createTestSection({ courseId: course._id })
        const lecture = await createTestLecture({ sectionId: section._id })

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        })

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}`
        );


        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();

        expect(response.body.data.course.toString())
            .toBe(course._id.toString())
        expect(response.body.data.student.toString())
            .toBe(user._id.toString())
        expect(response.body.data.status).toBe(PROGRESS_STATUS.IN_PROGRESS)

        expect(response.body.data.lectures[0].lecture.toString())
            .toBe(lecture._id.toString())
        expect(response.body.data.lectures[0].lastPosition).toBe(0)
        expect(response.body.data.lectures[0].watchedDuration).toBe(0)
        expect(response.body.data.lectures[0].isCompleted).toBe(false)


        expect(response.body.meta.course.totalLectures).toBe(1);
        expect(response.body.meta.course.completedLectures).toBe(0);
        expect(response.body.meta.course.totalCompletedDuration).toBe(0);
        expect(response.body.meta.course.progressPercentage).toBe(0);

        expect(response.body.meta.lectures).toHaveLength(1);
        expect(response.body.meta.lectures[0].progressPercentage).toBe(0);
        expect(response.body.meta.lectures[0].lectureId.toString())
            .toBe(lecture._id.toString());
    })

    it("should return 404 when course progress is not found", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id });
        const section = await createTestSection({ courseId: course._id })
        const lecture = await createTestLecture({ sectionId: section._id })

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        })

        // in initializeLectureProgress service, progress willl be fetch by 
        // courseId = req.params.courseId 
        // studentId = req.user._id

        // to test this case
        // use another course id in params

        const anotherCourse = await createTestCourse({
            instructorId: instructor._id,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${anotherCourse._id}/lectures/${lecture._id}`
        );


        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);

    })

    it("should return 404 when lecture is not found", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id });

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        })

        // in initializeLectureProgress service, lecture willl be fetch by 
        // lectureId = res.params.lectureId

        // to test this case
        // use non existing lecture id in params

        const nonExistingLectureId = new mongoose.Types.ObjectId();


        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${nonExistingLectureId}`
        );


        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);

    })

    it("should return 404 when lecture belongs to another course", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        // Course A — lecture belongs to this course
        const lectureCourse = await createTestCourse({ instructorId: instructor._id, });
        const section = await createTestSection({ courseId: lectureCourse._id, });
        const lecture = await createTestLecture({ sectionId: section._id, });

        // Course B — student has progress for this course
        const requestedCourse = await createTestCourse({
            instructorId: instructor._id,
        });

        const order = await createTestOrder({
            studentId: user._id,
            courseId: requestedCourse._id,
            amount: requestedCourse.price,
        });

        const payment = await createTestPayment({
            orderId: order._id,
            studentId: user._id,
            amount: requestedCourse.price,
        });

        await createTestEnrollment({
            studentId: user._id,
            courseId: requestedCourse._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: requestedCourse._id,
        });

        // Lecture belongs to lectureCourse,
        // but URL contains requestedCourse.

        const response = await agent.post(
            `/api/v1/progress/students/courses/${requestedCourse._id}/lectures/${lecture._id}`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it("should update last accessed lecture when lecture progress is already initialized", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();


        const course = await createTestCourse({ instructorId: instructor._id, });
        const section = await createTestSection({ courseId: course._id, });
        const lecture = await createTestLecture({ sectionId: section._id, });

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id
        })

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data.lastAccessedLecture.toString()).toBe(lecture._id.toString())
        expect(response.body.data.lectures[0].lecture.toString())
            .toBe(lecture._id.toString())
        expect(response.body.data.lectures[0].lastPosition).toBe(100)
        expect(response.body.data.lectures[0].watchedDuration).toBe(110)
        expect(response.body.data.lectures[0].isCompleted).toBe(false)

        expect(response.body.meta.course.totalDuration).toBe(lecture.video.duration)
        expect(response.body.meta.course.progressPercentage).toBe(0)

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

    it("should return 404 when course progress is not found", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id, });
        const section = await createTestSection({ courseId: course._id, });
        const lecture = await createTestLecture({ sectionId: section._id, });

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        // Do NOT create course progress.
        // Service should fail when progress is not found.

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

    it("should return 404 when lecture progress is not initialized", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const course = await createTestCourse({
            instructorId: instructor._id,
        });

        const section = await createTestSection({
            courseId: course._id,
        });

        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        // Create course progress,
        // but don't initialize lecture progress.
        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

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

    it("should return 404 when lecture is not found", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id, });
        const section = await createTestSection({ courseId: course._id, });
        await createTestLecture({ sectionId: section._id, });

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        // Use a valid ObjectId format, but no lecture exists with this ID.
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

    it("should return 404 when lecture belongs to another course", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const courseA = await createTestCourse({ instructorId: instructor._id, });
        const sectionA = await createTestSection({ courseId: courseA._id, });
        await createTestLecture({ sectionId: sectionA._id, });

        const courseB = await createTestCourse({ instructorId: instructor._id, });
        const sectionB = await createTestSection({ courseId: courseB._id, });
        const lectureB = await createTestLecture({ sectionId: sectionB._id });

        const order = await createTestOrder({
            studentId: user._id,
            courseId: courseA._id,
            amount: courseA.price,
        });

        const payment = await createTestPayment({
            orderId: order._id,
            studentId: user._id,
            amount: courseA.price,
        });

        await createTestEnrollment({
            studentId: user._id,
            courseId: courseA._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: courseA._id,
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

    it("should successfully update lecture progress", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const course = await createTestCourse({
            instructorId: instructor._id,
        });

        const section = await createTestSection({
            courseId: course._id,
        });

        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
        });

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

        expect(lectureProgress.lecture.toString())
            .toBe(lecture._id.toString());
        expect(lectureProgress.lastPosition).toBe(300);
        expect(lectureProgress.watchedDuration).toBe(300);
        expect(lectureProgress.isCompleted).toBe(false);

        expect(response.body.meta.lectures).toHaveLength(1);
        expect(response.body.meta.lectures[0].lectureId.toString())
            .toBe(lecture._id.toString());
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

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app)
            .post(
                "/api/v1/progress/students/courses/507f1f77bcf86cd799439011/lectures/507f1f77bcf86cd799439012/complete"
            );

        expect(response.status).toBe(401);
    });

    it("should return 404 when course progress is not found", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id });
        const section = await createTestSection({ courseId: course._id });
        const lecture = await createTestLecture({ sectionId: section._id });

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        // No course progress created.

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it("should return 404 when lecture progress is not initialized", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const course = await createTestCourse({
            instructorId: instructor._id,
        });

        const section = await createTestSection({
            courseId: course._id,
        });

        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        // Course progress exists,
        // but lecture progress does not.
        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });


    it("should return 404 when lecture is not found", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const course = await createTestCourse({
            instructorId: instructor._id,
        });

        const fakeLectureId = new mongoose.Types.ObjectId();

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

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


    it("should return 404 when lecture belongs to another course", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const course = await createTestCourse({
            instructorId: instructor._id,
        });

        const anotherCourse = await createTestCourse({
            instructorId: instructor._id,
        });

        const section = await createTestSection({
            courseId: anotherCourse._id,
        });

        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });


    it("should return 400 when lecture has not reached completion threshold", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const course = await createTestCourse({
            instructorId: instructor._id,
        });

        const section = await createTestSection({
            courseId: course._id,
        });

        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            PROGRESS_ERROR_MESSAGES.LECTURE_NOT_COMPLETED
        );
    });


    it("should complete lecture and update course progress", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({ instructorId: instructor._id, });
        const section = await createTestSection({ courseId: course._id, });
        const lecture = await createTestLecture({ sectionId: section._id, });

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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
            lastPosition: 540,
            watchedDuration: 540,
            isCompleted: false
        });

        console.log({
            duration: lecture.video.duration,
            watchedDuration: 500,
            percentage: (500 / lecture.video.duration) * 100,
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
        expect(
            response.body.meta.lectures[0].lectureId.toString()
        ).toBe(lecture._id.toString());

        expect(response.body.meta.lectures[0].progressPercentage)
            .toBe(90);
    });

    it("should return 400 when lecture completion threshold is not reached", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({
            instructorId: instructor._id,
        });
        const section = await createTestSection({
            courseId: course._id,
        });
        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
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

    it("should complete lecture when completion threshold is exactly reached", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({
            instructorId: instructor._id,
        });
        const section = await createTestSection({
            courseId: course._id,
        });
        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
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

        expect(
            response.body.meta.lectures[0].progressPercentage
        ).toBe(90);
    });

    it("should return existing progress when lecture is already completed", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();
        const course = await createTestCourse({
            instructorId: instructor._id,
        });
        const section = await createTestSection({
            courseId: course._id,
        });
        const lecture = await createTestLecture({
            sectionId: section._id,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: lecture._id,
            lastPosition: lecture.video.duration,
            watchedDuration: lecture.video.duration,
            isCompleted: true,
        });

        const response = await agent.post(
            `/api/v1/progress/students/courses/${course._id}/lectures/${lecture._id}/complete`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const lectureProgress = response.body.data.lectures[0];

        expect(lectureProgress.lecture.toString())
            .toBe(lecture._id.toString());

        expect(lectureProgress.lastPosition)
            .toBe(lecture.video.duration);

        expect(lectureProgress.watchedDuration)
            .toBe(lecture.video.duration);

        expect(lectureProgress.isCompleted)
            .toBe(true);

        expect(response.body.meta.course.totalLectures)
            .toBe(1);

        expect(response.body.meta.course.completedLectures)
            .toBe(1);

        expect(response.body.meta.course.progressPercentage)
            .toBe(100);

        expect(response.body.meta.lectures[0].progressPercentage)
            .toBe(100);
    });

    it("should complete the course when the final lecture is completed", async () => {
        const { agent, user } = await createAuthenticatedStudentAgent();

        const instructor = await createTestInstructor();

        const course = await createTestCourse({
            instructorId: instructor._id,
        });

        const firstSection = await createTestSection({
            courseId: course._id,
            order: 1,
        });

        const secondSection = await createTestSection({
            courseId: course._id,
            order: 2,
        });

        const firstLecture = await createTestLecture({
            sectionId: firstSection._id,
            order: 1,
        });

        const secondLecture = await createTestLecture({
            sectionId: secondSection._id,
            order: 1,
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

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
        });

        await createTestProgress({
            studentId: user._id,
            courseId: course._id,
        });

        // first lecture is already completed
        await makeTestLectureProgressExists({
            studentId: user._id,
            courseId: course._id,
            lectureId: firstLecture._id,
            lastPosition: firstLecture.video.duration,
            watchedDuration: firstLecture.video.duration,
            isCompleted: true,
        });

        // second lecture is ready to be completed
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

        // second lecture completed
        const secondLectureProgress = response.body.data.lectures.find(
            ({ lecture }) =>
                lecture.toString() === secondLecture._id.toString()
        );

        expect(secondLectureProgress.isCompleted).toBe(true);

        // course progress
        expect(response.body.meta.course.totalLectures).toBe(2);
        expect(response.body.meta.course.completedLectures).toBe(2);
        expect(response.body.meta.course.progressPercentage).toBe(100);

        // both lectures completed
        expect(response.body.meta.lectures).toHaveLength(2);

        expect(
            response.body.meta.lectures.every(
                ({ progressPercentage }) => progressPercentage === 100
            )
        ).toBe(true);

        // course should be completed
        expect(response.body.data.status).toBe(PROGRESS_STATUS.COMPLETED);

        expect(response.body.data.completedAt).toBeDefined();
        expect(response.body.data.completedAt).not.toBeNull();
    });

});

