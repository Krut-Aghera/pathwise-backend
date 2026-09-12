import { createAuthenticatedStudentAgent } from "../helpers/auth.helper.js";
import { createTestInstructor } from "../helpers/user.helper.js";
import { createTestCourse } from "../helpers/course.helper.js";
import { createTestOrder } from "../helpers/order.helper.js";
import { createTestPayment } from "../helpers/payment.helper.js";
import { createTestEnrollment } from "../helpers/enrollment.helper.js";

import { ORDER_STATUS } from "../../src/features/order/order.constants.js";
import { PAYMENT_STATUS } from "../../src/features/payment/payment.constants.js";

////////////////////////////////////////////////////////////////
// create base enrollment workflow scenario
//
// Student + instructor + published course.
// No order, payment, or enrollment exists yet.

const createEnrollmentWorkflowScenario = async () => {
    const { agent, user } = await createAuthenticatedStudentAgent();

    const instructor = await createTestInstructor();

    const course = await createTestCourse({
        instructorId: instructor._id,
    });

    return {
        agent,
        user,
        instructor,
        course,
    };
};

////////////////////////////////////////////////////////////////
// create pending order scenario
//
// Student + course + pending order.
// No payment or enrollment exists yet.

const createPendingOrderScenario = async ({
    providerOrderId = null,
    expiresAt = new Date(Date.now() + 15 * 60 * 1000),
} = {}) => {
    const scenario = await createEnrollmentWorkflowScenario();

    const order = await createTestOrder({
        studentId: scenario.user._id,
        courseId: scenario.course._id,
        amount: scenario.course.price,
        status: ORDER_STATUS.PENDING,
        providerOrderId,
        expiresAt,
    });

    return {
        ...scenario,
        order,
    };
};

////////////////////////////////////////////////////////////////
// create expired order scenario
//
// Pending order whose expiry time is already in the past.

const createExpiredOrderScenario = async () => {
    return createPendingOrderScenario({
        expiresAt: new Date(Date.now() - 60 * 1000),
    });
};

////////////////////////////////////////////////////////////////
// create initiated payment scenario
//
// Pending order with a Razorpay provider order ID.
// No local payment or enrollment exists yet.

const createInitiatedPaymentScenario = async () => {
    return createPendingOrderScenario({
        providerOrderId: `test-provider-order-${Date.now()}`,
    });
};

////////////////////////////////////////////////////////////////
// create successful payment scenario
//
// Pending order + provider order ID + successful local payment.
// Enrollment does not exist yet.
//
// Useful for testing duplicate verification behavior.

const createSuccessfulPaymentScenario = async () => {
    const scenario = await createInitiatedPaymentScenario();

    const payment = await createTestPayment({
        orderId: scenario.order._id,
        studentId: scenario.user._id,
        amount: scenario.course.price,
        providerOrderId: scenario.order.providerOrderId,
        status: PAYMENT_STATUS.SUCCESS,
    });

    return {
        ...scenario,
        payment,
    };
};

////////////////////////////////////////////////////////////////
// create completed order scenario
//
// Completed order + successful payment.
// Enrollment does not exist yet.
//
// Useful for testing the already-completed branch of
// completeCheckout() and order/payment restrictions.

const createCompletedOrderScenario = async () => {
    const scenario = await createEnrollmentWorkflowScenario();

    const order = await createTestOrder({
        studentId: scenario.user._id,
        courseId: scenario.course._id,
        amount: scenario.course.price,
        status: ORDER_STATUS.COMPLETED,
        providerOrderId: `test-provider-order-${Date.now()}`,
    });

    const payment = await createTestPayment({
        orderId: order._id,
        studentId: scenario.user._id,
        amount: scenario.course.price,
        providerOrderId: order.providerOrderId,
        status: PAYMENT_STATUS.SUCCESS,
    });

    return {
        ...scenario,
        order,
        payment,
    };
};

////////////////////////////////////////////////////////////////
// create enrolled course scenario
//
// Completed order + successful payment + enrollment.
//
// Useful for:
// - GET /enrollments
// - duplicate webhook
// - already-enrolled order creation

const createEnrolledCourseScenario = async () => {
    const scenario = await createCompletedOrderScenario();

    const enrollment = await createTestEnrollment({
        studentId: scenario.user._id,
        courseId: scenario.course._id,
        orderId: scenario.order._id,
        paymentId: scenario.payment._id,
    });

    return {
        ...scenario,
        enrollment,
    };
};

////////////////////////////////////////////////////////////////
// create completed enrollment workflow scenario
//
// Semantic alias for the final successful workflow state.

const createCompletedEnrollmentWorkflowScenario = async () => {
    return createEnrolledCourseScenario();
};

////////////////////////////////////////////////////////////////
// exports

export {
    createEnrollmentWorkflowScenario,
    createPendingOrderScenario,
    createExpiredOrderScenario,
    createInitiatedPaymentScenario,
    createSuccessfulPaymentScenario,
    createCompletedOrderScenario,
    createEnrolledCourseScenario,
    createCompletedEnrollmentWorkflowScenario,
};
