import mongoose from "mongoose";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../../setup/api.test.setup.js";
import app from "../../../src/app.js";

import {
    ORDER_ERROR_MESSAGES,
    ORDER_STATUS,
} from "../../../src/features/order/order.constants.js";

import {
    PAYMENT_ERROR_MESSAGES,
    PAYMENT_STATUS,
} from "../../../src/features/payment/payment.constants.js";

import paymentProvider from "../../../src/services/payment/payment.provider.js";

import Order from "../../../src/features/order/order.model.js";
import Payment from "../../../src/features/payment/payment.model.js";
import Enrollment from "../../../src/features/enrollment/enrollment.model.js";

import { RESOURCE_STATUS } from "../../../src/constants/resource.constants.js";

import {
    createEnrollmentWorkflowScenario,
    createPendingOrderScenario,
    createExpiredOrderScenario,
    createInitiatedPaymentScenario,
    createSuccessfulPaymentScenario,
    createCompletedOrderScenario,
    createEnrolledCourseScenario,
} from "../../fixtures/enrollment-workflow.fixture.js";

import { createTestEnrollment } from "../../helpers/enrollment.helper.js";
import { ENROLLMENT_ERROR_MESSAGES } from "../../../src/features/enrollment/enrollment.constants.js";
import { createTestPayment } from "../../helpers/payment.helper.js";

////////////////////////////////////////////////////////////////////////////////
// Restore every Razorpay provider spy after each test.
////////////////////////////////////////////////////////////////////////////////

afterEach(() => {
    vi.restoreAllMocks();
});

////////////////////////////////////////////////////////////////////////////////
// ORDER
////////////////////////////////////////////////////////////////////////////////

describe("POST /api/v1/orders/students", () => {
    // Unauthenticated students must not be able to create orders.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app)
            .post("/api/v1/orders/students")
            .send({
                course: new mongoose.Types.ObjectId(),
            });

        expect(response.status).toBe(401);
    });

    // Invalid MongoDB IDs must be rejected by request validation.

    it("should return 400 when course ID is invalid", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const response = await agent.post("/api/v1/orders/students").send({
            course: "invalid-course-id",
        });

        expect(response.status).toBe(400);
    });

    // A valid MongoDB ID that does not exist must return 404.

    it("should return 404 when course is not found", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const response = await agent.post("/api/v1/orders/students").send({
            course: new mongoose.Types.ObjectId(),
        });

        expect(response.status).toBe(404);
    });

    // Students can only purchase published courses.

    it("should return 404 when course is not published", async () => {
        const { agent, course } = await createEnrollmentWorkflowScenario();

        course.status = RESOURCE_STATUS.DRAFT;
        await course.save();

        const response = await agent.post("/api/v1/orders/students").send({
            course: course._id,
        });

        expect(response.status).toBe(404);
    });

    // An already-enrolled student cannot create another order
    // for the same course.

    it("should return 409 when student is already enrolled", async () => {
        const { agent, user, course, order, payment } =
            await createEnrolledCourseScenario();

        const response = await agent.post("/api/v1/orders/students").send({
            course: course._id,
        });

        expect(response.status).toBe(409);

        expect(response.body.message).toBe(
            ENROLLMENT_ERROR_MESSAGES.ALREADY_ENROLLED
        );

        const orders = await Order.find({
            student: user._id,
            course: course._id,
        });

        expect(orders).toHaveLength(1);
        expect(orders[0]._id.toString()).toBe(order._id.toString());

        const payments = await Payment.find({
            order: order._id,
        });

        expect(payments).toHaveLength(1);
        expect(payments[0]._id.toString()).toBe(payment._id.toString());
    });

    // Price, currency and status must come from trusted server-side data.
    // Client-provided values must not be able to manipulate the order.

    it("should create a pending order using course pricing", async () => {
        const { agent, user, course } =
            await createEnrollmentWorkflowScenario();

        const response = await agent.post("/api/v1/orders/students").send({
            course: course._id,
            amount: 1,
            currency: "USD",
            status: ORDER_STATUS.COMPLETED,
        });

        expect(response.status).toBe(201);

        expect(response.body.data).toBeDefined();
        expect(response.body.data.student.toString()).toBe(user._id.toString());
        expect(response.body.data.course._id).toBe(course._id.toString());

        expect(response.body.data.amount).toBe(course.price * 100);
        expect(response.body.data.currency).toBe("INR");
        expect(response.body.data.status).toBe(ORDER_STATUS.PENDING);

        expect(response.body.data.providerOrderId).toBeNull();
        expect(response.body.data.expiresAt).toBeDefined();

        const createdOrder = await Order.findById(response.body.data._id);

        expect(createdOrder).not.toBeNull();

        expect(createdOrder.student.toString()).toBe(user._id.toString());
        expect(createdOrder.course.toString()).toBe(course._id.toString());

        expect(createdOrder.amount).toBe(course.price * 100);
        expect(createdOrder.status).toBe(ORDER_STATUS.PENDING);

        expect(createdOrder.providerOrderId).toBeNull();

        expect(createdOrder.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    // An active pending order should be reused instead of creating
    // another order for the same student and course.

    it("should return the existing active pending order instead of creating a new one", async () => {
        const { agent, order, course, user } =
            await createPendingOrderScenario();

        const response = await agent.post("/api/v1/orders/students").send({
            course: course._id,
        });

        expect(response.status).toBe(201);

        expect(response.body.data._id.toString()).toBe(order._id.toString());

        expect(response.body.data.student.toString()).toBe(user._id.toString());

        const orders = await Order.find({
            student: user._id,
            course: course._id,
        });

        expect(orders).toHaveLength(1);
    });

    // An expired pending order must be marked as EXPIRED and a new
    // pending order must be created for the same student and course.

    it("should expire the old pending order and create a new order", async () => {
        const { agent, order, course, user } =
            await createExpiredOrderScenario();

        const response = await agent.post("/api/v1/orders/students").send({
            course: course._id,
        });

        expect(response.status).toBe(201);

        expect(response.body.data._id.toString()).not.toBe(
            order._id.toString()
        );

        const oldOrder = await Order.findById(order._id);

        expect(oldOrder).not.toBeNull();
        expect(oldOrder.status).toBe(ORDER_STATUS.EXPIRED);

        const orders = await Order.find({
            student: user._id,
            course: course._id,
        });

        expect(orders).toHaveLength(2);

        const newOrder = orders.find(
            (item) => item._id.toString() !== order._id.toString()
        );

        expect(newOrder).toBeDefined();
        expect(newOrder.status).toBe(ORDER_STATUS.PENDING);
    });
});

////////////////////////////////////////////////////////////////////////////////
// ORDER CANCELLATION
////////////////////////////////////////////////////////////////////////////////

describe("PATCH /api/v1/orders/students/:orderId/cancel", () => {
    // Unauthenticated users must not be able to cancel orders.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app).patch(
            "/api/v1/orders/students/507f1f77bcf86cd799439011/cancel"
        );

        expect(response.status).toBe(401);
    });

    // Invalid MongoDB IDs must be rejected by request validation.

    it("should return 400 when order ID is invalid", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const response = await agent.patch(
            "/api/v1/orders/students/invalid-order-id/cancel"
        );

        expect(response.status).toBe(400);
    });

    // A valid but nonexistent order must return 404.

    it("should return 404 when order is not found", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const orderId = new mongoose.Types.ObjectId();

        const response = await agent.patch(
            `/api/v1/orders/students/${orderId}/cancel`
        );

        expect(response.status).toBe(404);

        expect(response.body.message).toBe(
            ORDER_ERROR_MESSAGES.ORDER_NOT_FOUND
        );
    });

    // Students cannot modify another student's order.

    it("should return 403 when order belongs to another student", async () => {
        const firstScenario = await createPendingOrderScenario();

        const secondScenario = await createEnrollmentWorkflowScenario();

        const response = await secondScenario.agent.patch(
            `/api/v1/orders/students/${firstScenario.order._id}/cancel`
        );

        expect(response.status).toBe(403);

        expect(response.body.message).toBe(
            ORDER_ERROR_MESSAGES.ORDER_ACCESS_DENIED
        );

        const order = await Order.findById(firstScenario.order._id);

        expect(order.status).toBe(ORDER_STATUS.PENDING);
    });

    // Only pending orders may be cancelled.

    it("should return 400 when order is not pending", async () => {
        const { agent, order } = await createCompletedOrderScenario();

        const response = await agent.patch(
            `/api/v1/orders/students/${order._id}/cancel`
        );

        expect(response.status).toBe(400);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.status).toBe(ORDER_STATUS.COMPLETED);
    });

    // Expired orders remain pending in the cancellation workflow.
    // The cancellation service rejects them instead of transitioning
    // them to EXPIRED.

    it("should return 400 when order is expired", async () => {
        const { agent, order } = await createExpiredOrderScenario();

        const response = await agent.patch(
            `/api/v1/orders/students/${order._id}/cancel`
        );

        expect(response.status).toBe(400);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.status).toBe(ORDER_STATUS.EXPIRED);
    });

    // A valid pending order can be cancelled.

    it("should cancel a pending order", async () => {
        const { agent, order } = await createPendingOrderScenario();

        const response = await agent.patch(
            `/api/v1/orders/students/${order._id}/cancel`
        );

        expect(response.status).toBe(200);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();

        expect(updatedOrder.status).toBe(ORDER_STATUS.CANCELLED);
    });
});

////////////////////////////////////////////////////////////////////////////////
// PAYMENT CREATION
////////////////////////////////////////////////////////////////////////////////

describe("POST /api/v1/payments/orders/:orderId", () => {
    // Unauthenticated students cannot initialize payments.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app).post(
            "/api/v1/payments/orders/507f1f77bcf86cd799439011"
        );

        expect(response.status).toBe(401);
    });

    // Invalid MongoDB IDs must be rejected.

    it("should return 400 when order ID is invalid", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const response = await agent.post(
            "/api/v1/payments/orders/invalid-order-id"
        );

        expect(response.status).toBe(400);
    });

    // A nonexistent order must return 404.

    it("should return 404 when order is not found", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const orderId = new mongoose.Types.ObjectId();

        const response = await agent.post(`/api/v1/payments/orders/${orderId}`);

        expect(response.status).toBe(404);
    });

    // A student cannot initialize payment for another student's order.

    it("should return 404 when order belongs to another student", async () => {
        const firstScenario = await createPendingOrderScenario();

        const secondScenario = await createEnrollmentWorkflowScenario();

        const response = await secondScenario.agent.post(
            `/api/v1/payments/orders/${firstScenario.order._id}`
        );

        expect(response.status).toBe(404);
    });

    // Only pending orders can be paid.

    it("should return 400 when order is not pending", async () => {
        const { agent, order } = await createCompletedOrderScenario();

        const response = await agent.post(
            `/api/v1/payments/orders/${order._id}`
        );

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            ORDER_ERROR_MESSAGES.ORDER_NOT_PENDING
        );
    });

    // Expired pending orders are transitioned to EXPIRED.

    it("should return 409 and expire the order when order is expired", async () => {
        const { agent, order } = await createExpiredOrderScenario();

        const response = await agent.post(
            `/api/v1/payments/orders/${order._id}`
        );

        expect(response.status).toBe(409);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();

        expect(updatedOrder.status).toBe(ORDER_STATUS.EXPIRED);
    });

    // A provider order can only be initialized once.

    it("should return 409 when payment has already been initiated", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        const response = await agent.post(
            `/api/v1/payments/orders/${order._id}`
        );

        expect(response.status).toBe(409);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_ALREADY_INITIATED
        );
    });

    // Payment creation is protected by a short-lived database lock so
    // concurrent requests cannot create multiple provider orders.

    it("should return 409 when payment creation is already in progress", async () => {
        const { agent, order } = await createPendingOrderScenario();

        order.paymentCreationLockUntil = new Date(Date.now() + 30_000);

        await order.save();

        const createOrderSpy = vi.spyOn(paymentProvider, "createOrder");

        const response = await agent.post(
            `/api/v1/payments/orders/${order._id}`
        );

        expect(response.status).toBe(409);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_ALREADY_INITIATED
        );

        expect(createOrderSpy).not.toHaveBeenCalled();

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();

        expect(updatedOrder.paymentCreationLockUntil).not.toBeNull();
    });

    // Successful payment initialization must persist the
    // Razorpay provider order ID.

    it("should create a payment order and save provider order ID", async () => {
        const { agent, order } = await createPendingOrderScenario();

        const providerOrderId = `razorpay-order-${Date.now()}`;

        vi.spyOn(paymentProvider, "createOrder").mockResolvedValue({
            providerOrderId,
            orderId: order._id.toString(),
            amount: order.amount,
            currency: order.currency,
            status: "created",
        });

        const response = await agent.post(
            `/api/v1/payments/orders/${order._id}`
        );

        expect(response.status).toBe(201);

        expect(response.body.data.providerOrderId).toBe(providerOrderId);

        expect(response.body.data.amount).toBe(order.amount);

        expect(response.body.data.currency).toBe(order.currency);

        expect(response.body.data.status).toBe("created");

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();

        expect(updatedOrder.providerOrderId).toBe(providerOrderId);

        expect(updatedOrder.status).toBe(ORDER_STATUS.PENDING);
    });

    it("should release payment creation lock when provider order creation fails", async () => {
        const { agent, order } = await createPendingOrderScenario();

        const providerError = new Error("Razorpay provider request failed");

        vi.spyOn(paymentProvider, "createOrder").mockRejectedValueOnce(
            providerError
        );

        const response = await agent.post(
            `/api/v1/payments/orders/${order._id}`
        );

        expect(response.status).toBe(500);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();

        expect(updatedOrder.providerOrderId).toBeNull();

        expect(updatedOrder.paymentCreationLockUntil).toBeNull();
    });
});

////////////////////////////////////////////////////////////////////////////////
// PAYMENT VERIFICATION
////////////////////////////////////////////////////////////////////////////////

describe("POST /api/v1/payments/orders/:orderId/verify", () => {
    // Unauthenticated users cannot verify payments.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app)
            .post("/api/v1/payments/orders/507f1f77bcf86cd799439011/verify")
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: "order_test",
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(401);
    });

    // Invalid MongoDB IDs must be rejected.

    it("should return 400 when order ID is invalid", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const response = await agent
            .post("/api/v1/payments/orders/invalid-order-id/verify")
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: "order_test",
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(400);
    });

    // All Razorpay verification fields are required.

    it("should return 400 when Razorpay payment ID is missing", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(400);
    });

    it("should return 400 when Razorpay order ID is missing", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(400);
    });

    it("should return 400 when Razorpay signature is missing", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: order.providerOrderId,
            });

        expect(response.status).toBe(400);
    });

    // A nonexistent order must return 404.

    it("should return 404 when order is not found", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const orderId = new mongoose.Types.ObjectId();

        const response = await agent
            .post(`/api/v1/payments/orders/${orderId}/verify`)
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: "order_test",
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(404);
    });

    // A student cannot verify another student's order.

    it("should return 404 when order belongs to another student", async () => {
        const firstScenario = await createInitiatedPaymentScenario();

        const secondScenario = await createEnrollmentWorkflowScenario();

        const response = await secondScenario.agent
            .post(`/api/v1/payments/orders/${firstScenario.order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: firstScenario.order.providerOrderId,
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(404);
    });

    // Verification cannot happen until a provider order exists.

    it("should return 400 when order has no provider order ID", async () => {
        const { agent, order } = await createPendingOrderScenario();

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: "order_test",
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED
        );
    });

    // The Razorpay order ID must match the provider order stored
    // on the local order.

    it("should return 400 when Razorpay order ID does not match local order", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: "different-provider-order",
                razorpay_signature: "signature_test",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT
        );
    });

    // The payment service converts an invalid provider signature
    // into a PAYMENT_VERIFICATION_FAILED ApiError.

    it("should return 400 when Razorpay signature is invalid", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockRejectedValue(
            new Error("Invalid Razorpay payment signature.")
        );

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_test",
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "invalid-signature",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED
        );
    });

    // A captured provider payment should:
    // 1. create the local payment,
    // 2. complete the order,
    // 3. create the enrollment.

    it("should verify payment and complete the enrollment workflow", async () => {
        const { agent, user, course, order } =
            await createInitiatedPaymentScenario();

        const providerPaymentId = `razorpay-payment-${Date.now()}`;

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: providerPaymentId,
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(200);

        expect(response.body.data).toBeDefined();
        expect(response.body.data.payment).toBeDefined();
        expect(response.body.data.order).toBeDefined();
        expect(response.body.data.enrollment).toBeDefined();

        expect(response.body.data.payment.status).toBe(PAYMENT_STATUS.SUCCESS);

        expect(response.body.data.payment.order.toString()).toBe(
            order._id.toString()
        );

        expect(response.body.data.payment.student.toString()).toBe(
            user._id.toString()
        );

        expect(response.body.data.payment.amount).toBe(order.amount);

        expect(response.body.data.payment.currency).toBe(order.currency);

        expect(response.body.data.payment.providerOrderId).toBe(
            order.providerOrderId
        );

        expect(response.body.data.payment.providerPaymentId).toBe(
            providerPaymentId
        );

        expect(response.body.data.order.status).toBe(ORDER_STATUS.COMPLETED);

        expect(response.body.data.order._id.toString()).toBe(
            order._id.toString()
        );

        expect(response.body.data.enrollment.student.toString()).toBe(
            user._id.toString()
        );

        expect(response.body.data.enrollment.course.toString()).toBe(
            course._id.toString()
        );

        expect(response.body.data.enrollment.order.toString()).toBe(
            order._id.toString()
        );

        expect(response.body.data.enrollment.payment.toString()).toBe(
            response.body.data.payment._id.toString()
        );

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();

        expect(updatedOrder.status).toBe(ORDER_STATUS.COMPLETED);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).not.toBeNull();

        expect(payment.status).toBe(PAYMENT_STATUS.SUCCESS);

        expect(payment.providerPaymentId).toBe(providerPaymentId);

        const enrollment = await Enrollment.findOne({
            student: user._id,
            course: course._id,
        });

        expect(enrollment).not.toBeNull();

        expect(enrollment.order.toString()).toBe(order._id.toString());

        expect(enrollment.payment.toString()).toBe(payment._id.toString());
    });

    // An expired order must not be completed even when the provider
    // reports a captured payment.

    it("should return 400 when verifying payment for an expired order", async () => {
        const { agent, order, user, course } =
            await createInitiatedPaymentScenario();

        order.expiresAt = new Date(Date.now() - 60 * 1000);

        await order.save();

        const providerPaymentId = `razorpay-payment-expired-${Date.now()}`;

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: providerPaymentId,
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(ORDER_ERROR_MESSAGES.ORDER_EXPIRED);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.EXPIRED);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).toBeNull();

        const enrollment = await Enrollment.findOne({
            student: user._id,
            course: course._id,
        });

        expect(enrollment).toBeNull();
    });

    // A captured provider payment with a different amount must not
    // complete the local order or create a successful payment.

    it("should return 400 when Razorpay payment amount does not match order amount", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: "pay_amount_mismatch",
            order_id: order.providerOrderId,
            amount: order.amount + 100,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_amount_mismatch",
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_AMOUNT_MISMATCH
        );

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.PENDING);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).toBeNull();

        const enrollment = await Enrollment.findOne({
            student: order.student,
            course: order.course,
        });

        expect(enrollment).toBeNull();
    });

    // A captured provider payment with a different currency must not
    // complete the local order or create a successful payment.

    it("should return 400 when Razorpay payment currency does not match order currency", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: "pay_currency_mismatch",
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: "USD",
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_currency_mismatch",
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_CURRENCY_MISMATCH
        );

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.PENDING);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).toBeNull();

        const enrollment = await Enrollment.findOne({
            student: order.student,
            course: order.course,
        });

        expect(enrollment).toBeNull();
    });

    // A failed/non-captured provider payment must not modify
    // the local order or create a payment.

    it("should return 400 when Razorpay payment is not captured", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: "pay_failed",
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "failed",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_failed",
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED
        );

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.status).toBe(ORDER_STATUS.PENDING);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).toBeNull();
    });

    // A provider payment for another Razorpay order must not
    // complete the local order.

    it("should return 400 when Razorpay payment belongs to another provider order", async () => {
        const { agent, order } = await createInitiatedPaymentScenario();

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: "pay_wrong_order",
            order_id: "another-provider-order",
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: "pay_wrong_order",
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED
        );

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.status).toBe(ORDER_STATUS.PENDING);
    });

    // If the local payment already exists, verification must not
    // create a second payment.

    it("should complete an order using an existing successful payment", async () => {
        const { agent, user, course, order, payment } =
            await createSuccessfulPaymentScenario();

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: payment.providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: payment.providerPaymentId,
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(200);

        expect(response.body.data.payment._id.toString()).toBe(
            payment._id.toString()
        );

        expect(response.body.data.order.status).toBe(ORDER_STATUS.COMPLETED);

        expect(response.body.data.enrollment).toBeDefined();

        const paymentCount = await Payment.countDocuments({
            order: order._id,
        });

        expect(paymentCount).toBe(1);

        const enrollmentCount = await Enrollment.countDocuments({
            student: user._id,
            course: course._id,
        });

        expect(enrollmentCount).toBe(1);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.status).toBe(ORDER_STATUS.COMPLETED);
    });

    // A provider payment ID that already belongs to another local order
    // must never be reused for the current order.

    it("should return 400 when provider payment already belongs to another order", async () => {
        const firstScenario = await createInitiatedPaymentScenario();

        const secondScenario = await createInitiatedPaymentScenario();

        const providerPaymentId = `razorpay-payment-existing-other-order-${Date.now()}`;

        // Create an existing successful payment for the second order.
        const existingPayment = await createTestPayment({
            orderId: secondScenario.order._id,
            studentId: secondScenario.user._id,
            amount: secondScenario.order.amount,
            providerOrderId: secondScenario.order.providerOrderId,
            providerPaymentId,
            status: PAYMENT_STATUS.SUCCESS,
        });

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        // The provider payment itself appears to belong to the FIRST order.
        // The local payment with the same providerPaymentId belongs to the SECOND order.
        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: firstScenario.order.providerOrderId,
            amount: firstScenario.order.amount,
            currency: firstScenario.order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await firstScenario.agent
            .post(`/api/v1/payments/orders/${firstScenario.order._id}/verify`)
            .send({
                razorpay_payment_id: providerPaymentId,
                razorpay_order_id: firstScenario.order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT
        );

        // The first order must remain pending.
        const firstOrder = await Order.findById(firstScenario.order._id);

        expect(firstOrder).not.toBeNull();
        expect(firstOrder.status).toBe(ORDER_STATUS.PENDING);

        // The existing payment must still belong to the second order.
        const payment = await Payment.findById(existingPayment._id);

        expect(payment).not.toBeNull();

        expect(payment.order.toString()).toBe(
            secondScenario.order._id.toString()
        );

        expect(payment.providerPaymentId).toBe(providerPaymentId);

        // No payment must be created for the first order.
        const firstOrderPaymentCount = await Payment.countDocuments({
            order: firstScenario.order._id,
        });

        expect(firstOrderPaymentCount).toBe(0);

        // No enrollment must be created for the first order/course.
        const firstEnrollment = await Enrollment.findOne({
            student: firstScenario.user._id,
            course: firstScenario.course._id,
        });

        expect(firstEnrollment).toBeNull();
    });

    // Retrying verification for an already completed order must be
    // idempotent and must not create duplicate payment or enrollment records.

    it("should return the existing payment and enrollment when verifying an already completed order", async () => {
        const { agent, user, course, order, payment } =
            await createSuccessfulPaymentScenario();

        order.status = ORDER_STATUS.COMPLETED;

        await order.save();

        const providerPaymentId = payment.providerPaymentId;

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: providerPaymentId,
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(200);

        expect(response.body.data.payment).toBeDefined();
        expect(response.body.data.order).toBeDefined();
        expect(response.body.data.enrollment).toBeDefined();

        expect(response.body.data.payment._id.toString()).toBe(
            payment._id.toString()
        );

        expect(response.body.data.order._id.toString()).toBe(
            order._id.toString()
        );

        expect(response.body.data.order.status).toBe(ORDER_STATUS.COMPLETED);

        expect(response.body.data.enrollment.student.toString()).toBe(
            user._id.toString()
        );

        expect(response.body.data.enrollment.course.toString()).toBe(
            course._id.toString()
        );

        expect(response.body.data.enrollment.order.toString()).toBe(
            order._id.toString()
        );

        expect(response.body.data.enrollment.payment.toString()).toBe(
            payment._id.toString()
        );

        const paymentCount = await Payment.countDocuments({
            order: order._id,
        });

        expect(paymentCount).toBe(1);

        const enrollmentCount = await Enrollment.countDocuments({
            student: user._id,
            course: course._id,
        });

        expect(enrollmentCount).toBe(1);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.COMPLETED);
    });

    // If enrollment creation loses a concurrent unique-index race,
    // the existing enrollment must be returned instead of failing checkout.

    it("should complete verification when enrollment creation hits a duplicate-key race", async () => {
        const { agent, user, course, order } =
            await createInitiatedPaymentScenario();

        const providerPaymentId = `razorpay-payment-enrollment-race-${Date.now()}`;

        vi.spyOn(paymentProvider, "verifyPaymentSignature").mockResolvedValue(
            true
        );

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        // Simulate another concurrent request winning the enrollment race.
        const existingEnrollment = await Enrollment.create({
            student: user._id,
            course: course._id,
            order: order._id,
            payment: new mongoose.Types.ObjectId(),
        });

        const response = await agent
            .post(`/api/v1/payments/orders/${order._id}/verify`)
            .send({
                razorpay_payment_id: providerPaymentId,
                razorpay_order_id: order.providerOrderId,
                razorpay_signature: "valid-signature",
            });

        expect(response.status).toBe(200);

        expect(response.body.data.payment).toBeDefined();
        expect(response.body.data.order).toBeDefined();
        expect(response.body.data.enrollment).toBeDefined();

        expect(response.body.data.order.status).toBe(ORDER_STATUS.COMPLETED);

        expect(response.body.data.enrollment._id.toString()).toBe(
            existingEnrollment._id.toString()
        );

        expect(response.body.data.enrollment.student.toString()).toBe(
            user._id.toString()
        );

        expect(response.body.data.enrollment.course.toString()).toBe(
            course._id.toString()
        );

        expect(response.body.data.enrollment.order.toString()).toBe(
            order._id.toString()
        );

        const enrollmentCount = await Enrollment.countDocuments({
            student: user._id,
            course: course._id,
        });

        expect(enrollmentCount).toBe(1);
    });
});

////////////////////////////////////////////////////////////////////////////////
// RAZORPAY WEBHOOK
////////////////////////////////////////////////////////////////////////////////

describe("POST /api/v1/payments/webhooks/razorpay", () => {
    // Provider webhook verification errors are currently not converted
    // to an ApiError inside paymentService.handleWebhook().
    //
    // Therefore this test reflects the current implementation:
    // the provider error reaches the global error handler.
    //
    // If you later map provider verification failures to a 400 ApiError,
    // change this expectation to 400 and assert the corresponding message.

    it("should return 500 when webhook signature verification throws", async () => {
        vi.spyOn(paymentProvider, "verifyWebhook").mockRejectedValue(
            new Error("Invalid Razorpay webhook signature.")
        );

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "invalid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(500);
    });

    // Unsupported webhook events must be rejected.

    it("should return 400 when webhook event is unsupported", async () => {
        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "payment.failed",
            providerOrderId: "order_test",
            providerPaymentId: "pay_test",
            status: "failed",
            method: "card",
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "payment.failed",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.UNSUPPORTED_WEBHOOK_EVENT
        );
    });

    // Webhooks must contain the provider order ID.

    it("should return 400 when webhook provider order ID is missing", async () => {
        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: null,
            providerPaymentId: "pay_test",
            status: "captured",
            method: "card",
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.INVALID_WEBHOOK
        );
    });

    // Webhooks must contain the provider payment ID.

    it("should return 400 when webhook provider payment ID is missing", async () => {
        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: "order_test",
            providerPaymentId: null,
            status: "captured",
            method: "card",
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.INVALID_WEBHOOK
        );
    });

    // A webhook for an unknown provider order cannot complete
    // the workflow.

    it("should return 404 when webhook order is not found", async () => {
        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: "unknown-provider-order",
            providerPaymentId: "provider-payment",
            status: "captured",
            method: "card",
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(404);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.ORDER_NOT_FOUND
        );
    });

    // A valid order.paid webhook must complete the entire workflow.

    it("should process successful Razorpay webhook", async () => {
        const { user, course, order } = await createInitiatedPaymentScenario();

        const providerPaymentId = `razorpay-webhook-payment-${Date.now()}`;

        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: order.providerOrderId,
            providerPaymentId,
            status: "captured",
            method: "card",
        });

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(200);

        expect(response.body.data).toBeNull();

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();

        expect(updatedOrder.status).toBe(ORDER_STATUS.COMPLETED);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).not.toBeNull();

        expect(payment.status).toBe(PAYMENT_STATUS.SUCCESS);

        expect(payment.providerOrderId).toBe(order.providerOrderId);

        expect(payment.providerPaymentId).toBe(providerPaymentId);

        const enrollment = await Enrollment.findOne({
            student: user._id,
            course: course._id,
        });

        expect(enrollment).not.toBeNull();

        expect(enrollment.order.toString()).toBe(order._id.toString());

        expect(enrollment.payment.toString()).toBe(payment._id.toString());

        expect(enrollment.course.toString()).toBe(course._id.toString());
    });

    // An expired order must not be completed through the Razorpay webhook.
    // Webhooks must obey the same order-expiry protection as normal verification.
    it("should return 400 when webhook payment belongs to an expired order", async () => {
        const { order, user, course } = await createInitiatedPaymentScenario();

        order.expiresAt = new Date(Date.now() - 60 * 1000);

        await order.save();

        const providerPaymentId = `razorpay-payment-expired-webhook-${Date.now()}`;

        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: order.providerOrderId,
            providerPaymentId,
            status: "captured",
            method: "card",
        });

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(ORDER_ERROR_MESSAGES.ORDER_EXPIRED);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.EXPIRED);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).toBeNull();

        const enrollment = await Enrollment.findOne({
            student: user._id,
            course: course._id,
        });

        expect(enrollment).toBeNull();
    });

    // A captured Razorpay payment with a different amount must not complete
    // the local order or create a successful payment/enrollment.
    it("should return 400 when webhook payment amount does not match order amount", async () => {
        const { order, user, course } = await createInitiatedPaymentScenario();

        const providerPaymentId = `razorpay-webhook-amount-mismatch-${Date.now()}`;

        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: order.providerOrderId,
            providerPaymentId,
            status: "captured",
            method: "card",
        });

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount + 100,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_AMOUNT_MISMATCH
        );

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.PENDING);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).toBeNull();

        const enrollment = await Enrollment.findOne({
            student: user._id,
            course: course._id,
        });

        expect(enrollment).toBeNull();
    });

    // A captured Razorpay payment with a different currency must not complete
    // the local order or create a successful payment/enrollment.
    it("should return 400 when webhook payment currency does not match order currency", async () => {
        const { order, user, course } = await createInitiatedPaymentScenario();

        const providerPaymentId = `razorpay-webhook-currency-mismatch-${Date.now()}`;

        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: order.providerOrderId,
            providerPaymentId,
            status: "captured",
            method: "card",
        });

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: "USD",
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            PAYMENT_ERROR_MESSAGES.PAYMENT_CURRENCY_MISMATCH
        );

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.PENDING);

        const payment = await Payment.findOne({
            order: order._id,
        });

        expect(payment).toBeNull();

        const enrollment = await Enrollment.findOne({
            student: user._id,
            course: course._id,
        });

        expect(enrollment).toBeNull();
    });

    // A webhook received after the order has already been completed must remain idempotent.
    // It must return the existing payment/enrollment instead of creating duplicates.
    it("should remain idempotent when webhook is received for an already completed order", async () => {
        const { order, user, course, payment } =
            await createSuccessfulPaymentScenario();

        order.status = ORDER_STATUS.COMPLETED;
        await order.save();

        const providerPaymentId = payment.providerPaymentId;

        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: order.providerOrderId,
            providerPaymentId,
            status: "captured",
            method: "card",
        });

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const response = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(response.status).toBe(200);

        expect(response.body.data).toBeNull();

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder).not.toBeNull();
        expect(updatedOrder.status).toBe(ORDER_STATUS.COMPLETED);

        const paymentCount = await Payment.countDocuments({
            order: order._id,
        });

        expect(paymentCount).toBe(1);

        const enrollmentCount = await Enrollment.countDocuments({
            student: user._id,
            course: course._id,
        });

        expect(enrollmentCount).toBe(1);

        const existingPayment = await Payment.findOne({
            order: order._id,
        });

        expect(existingPayment).not.toBeNull();
        expect(existingPayment._id.toString()).toBe(payment._id.toString());

        const enrollment = await Enrollment.findOne({
            student: user._id,
            course: course._id,
        });

        expect(enrollment).not.toBeNull();
        expect(enrollment.order.toString()).toBe(order._id.toString());
        expect(enrollment.payment.toString()).toBe(payment._id.toString());
        expect(enrollment.student.toString()).toBe(user._id.toString());
        expect(enrollment.course.toString()).toBe(course._id.toString());
    });

    // Repeated successful webhooks must be idempotent.
    it("should process duplicate webhook without creating duplicate records", async () => {
        const { user, course, order, payment } =
            await createSuccessfulPaymentScenario();

        vi.spyOn(paymentProvider, "verifyWebhook").mockResolvedValue({
            event: "order.paid",
            providerOrderId: order.providerOrderId,
            providerPaymentId: payment.providerPaymentId,
            status: "captured",
            method: "card",
        });

        vi.spyOn(paymentProvider, "getPaymentById").mockResolvedValue({
            id: payment.providerPaymentId,
            order_id: order.providerOrderId,
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            method: "card",
            created_at: Math.floor(Date.now() / 1000),
        });

        const firstResponse = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(firstResponse.status).toBe(200);

        const secondResponse = await request(app)
            .post("/api/v1/payments/webhooks/razorpay")
            .set("x-razorpay-signature", "valid-signature")
            .send({
                event: "order.paid",
            });

        expect(secondResponse.status).toBe(200);

        const paymentCount = await Payment.countDocuments({
            order: order._id,
        });

        expect(paymentCount).toBe(1);

        const enrollmentCount = await Enrollment.countDocuments({
            student: user._id,
            course: course._id,
        });

        expect(enrollmentCount).toBe(1);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.status).toBe(ORDER_STATUS.COMPLETED);
    });
});

////////////////////////////////////////////////////////////////////////////////
// ENROLLMENT
////////////////////////////////////////////////////////////////////////////////

describe("GET /api/v1/enrollments", () => {
    // Unauthenticated users cannot fetch enrollments.

    it("should return 401 when student is not authenticated", async () => {
        const response = await request(app).get("/api/v1/enrollments");

        expect(response.status).toBe(401);
    });

    // An authenticated student with no enrollments receives an empty list.

    it("should return empty enrollments for a student with no enrollments", async () => {
        const { agent } = await createEnrollmentWorkflowScenario();

        const response = await agent.get("/api/v1/enrollments");

        expect(response.status).toBe(200);

        expect(response.body.data).toEqual([]);
    });

    // The student should receive their own enrollment with
    // the course populated.

    it("should fetch all enrollments for the authenticated student", async () => {
        const { agent, user, course, enrollment } =
            await createEnrolledCourseScenario();

        const response = await agent.get("/api/v1/enrollments");

        expect(response.status).toBe(200);

        expect(response.body.data).toBeDefined();

        expect(Array.isArray(response.body.data)).toBe(true);

        expect(response.body.data).toHaveLength(1);

        expect(response.body.data[0]._id.toString()).toBe(
            enrollment._id.toString()
        );

        expect(response.body.data[0].student.toString()).toBe(
            user._id.toString()
        );

        expect(response.body.data[0].course).toBeDefined();

        expect(response.body.data[0].course._id.toString()).toBe(
            course._id.toString()
        );
    });

    // A student must only see their own enrollments.

    it("should return only enrollments belonging to the authenticated student", async () => {
        const firstScenario = await createEnrolledCourseScenario();

        const secondScenario = await createEnrolledCourseScenario();

        const response = await firstScenario.agent.get("/api/v1/enrollments");

        expect(response.status).toBe(200);

        expect(response.body.data).toHaveLength(1);

        expect(response.body.data[0].student.toString()).toBe(
            firstScenario.user._id.toString()
        );

        expect(response.body.data[0].course._id.toString()).toBe(
            firstScenario.course._id.toString()
        );

        expect(response.body.data[0].course._id.toString()).not.toBe(
            secondScenario.course._id.toString()
        );
    });

    // Soft-deleted enrollments must not be returned.

    it("should not return deleted enrollments", async () => {
        const { agent, user, course, order, payment } =
            await createCompletedOrderScenario();

        await createTestEnrollment({
            studentId: user._id,
            courseId: course._id,
            orderId: order._id,
            paymentId: payment._id,
            isDeleted: true,
        });

        const response = await agent.get("/api/v1/enrollments");

        expect(response.status).toBe(200);

        expect(response.body.data).toEqual([]);
    });
});
