import * as orderRepository from "../../features/order/order.repository.js";
import * as paymentRepository from "../../features/payment/payment.repository.js";
import * as paymentService from "../../features/payment/payment.service.js";
import * as enrollmentService from "../../features/enrollment/enrollment.service.js";

import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { ORDER_STATUS } from "../../features/order/order.constants.js";
import { PAYMENT_ERROR_MESSAGES } from "../../features/payment/payment.constants.js";

///////////////////////////////////////////////////////////////
// complete checkout workflow

const completeCheckout = async ({ order, providerPaymentId }) => {
    let payment;

    // ---------------------------------------------------------
    // Already completed
    // ---------------------------------------------------------

    if (order.status === ORDER_STATUS.COMPLETED) {
        payment = await paymentRepository.findSuccessfulPaymentByOrderId({
            orderId: order._id,
        });

        if (!payment) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,
            });
        }
    }

    // ---------------------------------------------------------
    // Pending order
    // ---------------------------------------------------------
    else {
        if (order.status !== ORDER_STATUS.PENDING) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: PAYMENT_ERROR_MESSAGES.ORDER_NOT_PENDING,
            });
        }

        if (!providerPaymentId) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,
            });
        }

        payment = await paymentService.verifySuccessfulPayment({
            order,
            providerPaymentId,
        });

        order.status = ORDER_STATUS.COMPLETED;

        await orderRepository.saveOrder({
            order,
        });
    }

    // ---------------------------------------------------------
    // Enrollment
    // ---------------------------------------------------------

    const enrollment = await enrollmentService.createEnrollment({
        enrollmentPayload: {
            student: order.student,
            course: order.course,
            order: order._id,
            payment: payment._id,
        },
    });

    return {
        payment,
        order,
        enrollment,
    };
};

export { completeCheckout };
