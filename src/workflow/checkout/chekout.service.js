import * as paymentService from "../../features/payment/payment.service.js";
import * as paymentRepository from "../../features/payment/payment.repository.js";
import * as orderRepository from "../../features/order/order.repository.js";
import * as enrollmentRepository from "../../features/enrollment/enrollment.repository.js";

import { getStudentOrder } from "../../features/payment/payment.utility.js";
import ApiError from "../../utils/error-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { ORDER_STATUS } from "../../features/order/order.constants.js";
import { PAYMENT_ERROR_MESSAGES } from "../../features/payment/payment.constants.js";

///////////////////////////////////////////////////////////////
// complete checkout flow

const completeCheckout = async ({ orderId, studentId }) => {
    const order = await getStudentOrder({
        orderId,
        studentId,
    });

    let payment;

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
    } else {
        if (order.status !== ORDER_STATUS.PENDING) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: PAYMENT_ERROR_MESSAGES.ORDER_NOT_PENDING,
            });
        }

        payment = await paymentService.verifyPayment({
            order,
        });

        order.status = ORDER_STATUS.COMPLETED;

        await orderRepository.saveOrder({
            order,
        });
    }

    let enrollment = await enrollmentRepository.findEnrollment({
        studentId: order.student,
        courseId: order.course,
    });

    if (!enrollment) {
        enrollment = await enrollmentRepository.createEnrollment({
            enrollmentPayload: {
                student: order.student,
                course: order.course,
                order: order._id,
                payment: payment._id,
            },
        });
    }

    return {
        payment,
        order,
        enrollment,
    };
};

export { completeCheckout };
