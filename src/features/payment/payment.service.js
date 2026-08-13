import * as orderRepository from "../order/order.repository.js";

import ApiError from "../../utils/error-handler.utility.js";
import PaymentGatewayService from "../../services/payment/payment-service.service.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { PAYMENT_ERROR_MESSAGES, PAYMENT_STATUS } from "./payment.constants.js";
import { getStudentPendingOrder } from "./payment.utility.js";

///////////////////////////////////////////////////////////////
// create payment service

const createPayment = async ({ orderId, studentId, studentEmail }) => {
    const order = await getStudentPendingOrder({ orderId, studentId });

    const providerOrder = await PaymentGatewayService.createPaymentOrder({
        order,
        student: {
            _id: studentId,
            email: studentEmail,
        },
    });

    order.providerOrderId = providerOrder.providerOrderId;
    await orderRepository.saveOrder({ order });

    return providerOrder;
};

///////////////////////////////////////////////////////////////
// verify payment service

const verifyPayment = async ({ order }) => {
    const payment = await PaymentGatewayService.syncSuccessfulPaymentForOrder({
        order,
    });

    if (!payment) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,
        });
    }

    if (payment.status !== PAYMENT_STATUS.SUCCESS) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,
        });
    }

    if (
        !order.providerOrderId ||
        payment.providerOrderId !== order.providerOrderId
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT,
        });
    }

    if (payment.amount !== order.amount) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.PAYMENT_AMOUNT_MISMATCH,
        });
    }

    if (payment.currency !== order.currency) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.PAYMENT_CURRENCY_MISMATCH,
        });
    }

    return payment;
};

///////////////////////////////////////////////////////////////
// exports

export { createPayment, verifyPayment };
