import User from "../../src/features/user/user.model.js";
import Course from "../../src/features/course/course.model.js";
import Section from "../../src/features/section/section.model.js";
import Lecture from "../../src/features/lecture/lecture.model.js";
import Order from "../../src/features/order/order.model.js";
import Payment from "../../src/features/payment/payment.model.js";
import Enrollment from "../../src/features/enrollment/enrollment.model.js";
import Progress from "../../src/features/progress/progress.model.js";

import { ROLES } from "../../src/features/user/user.constants.js";
import { RESOURCE_STATUS } from "../../src/constants/resource.constants.js"
import { ORDER_CURRENCY, ORDER_STATUS } from "../../src/features/order/order.constants.js";
import { PAYMENT_METHOD, PAYMENT_PROVIDER, PAYMENT_STATUS } from "../../src/features/payment/payment.constants.js";


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestInstructor = async () => {
    return await User.create({
        username: `test_instructor_${Date.now()}`,
        email: `test_instructor_${Date.now()}@example.com`,
        password: "TestPassword123!",
        role: ROLES.INSTRUCTOR,
        isEmailVerified: true,
        isActive: true,
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestCourse = async ({ instructorId }) => {
    return await Course.create({
        instructor: instructorId,
        title: `Test Progress Course ${Date.now()}`,
        subtitle: "Course for progress API testing",
        slug: `test-progress-course-${Date.now()}`,
        description: "Test course used for Progress API integration tests.",
        price: 999,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestSection = async ({
    courseId,
    order = 1,
}) => {
    return Section.create({
        course: courseId,
        title: `Test Progress Section ${Date.now()}`,
        order,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestLecture = async ({ sectionId, order = 1 }) => {
    return await Lecture.create({
        section: sectionId,
        title: `Test Lecture ${Date.now()}`,
        description: "Test lecture for Progress API testing.",
        video: {
            publicId: `test-video-${Date.now()}`,
            url: "https://example.com/test-video.mp4",
            thumbnailUrl: "https://example.com/test-thumbnail.jpg",
            duration: 600,
            fileSize: 1000000,
            format: "mp4",
            width: 1280,
            height: 720,
        },
        isPreviewFree: false,
        order,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestOrder = async ({ studentId, courseId, amount }) => {
    return await Order.create({
        student: studentId,
        course: courseId,
        amount,
        currency: ORDER_CURRENCY,
        status: ORDER_STATUS.COMPLETED,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestPayment = async ({ orderId, studentId, amount }) => {
    return await Payment.create({
        order: orderId,
        student: studentId,
        amount,
        currency: ORDER_CURRENCY,
        method: PAYMENT_METHOD.CREDIT_CARD,
        provider: PAYMENT_PROVIDER.CASHFREE,
        providerOrderId: `test-provider-order-${Date.now()}`,
        providerPaymentId: `test-provider-payment-${Date.now()}`,
        status: PAYMENT_STATUS.SUCCESS,
        paidAt: Date.now()
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestEnrollment = async ({ studentId, courseId, orderId, paymentId }) => {
    return await Enrollment.create({
        student: studentId,
        course: courseId,
        order: orderId,
        payment: paymentId,
        isDeleted: false
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const createTestProgress = async ({
    studentId,
    courseId, }) => {

    return await Progress.create({
        student: studentId,
        course: courseId
    });
};


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

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
///////////////////////////////////////////////////////////////

const makeTestLectureProgressExists = async ({
    studentId,
    courseId,
    lectureId,
    lastPosition = 100,
    watchedDuration = 110,
    isCompleted = false
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
                    isCompleted
                },
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

export {
    createTestInstructor,
    createTestCourse,
    createTestSection,
    createTestLecture,
    createTestOrder,
    createTestPayment,
    createTestEnrollment,
    createTestProgress,
    fetchTestProgress,
    makeTestLectureProgressExists
}