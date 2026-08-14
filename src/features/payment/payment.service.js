import * as orderRepository from "../order/order.repository.js";

import PaymentGatewayService from "../../services/payment/payment.layer.js";
import { completeCheckout } from "../../workflow/checkout/chekout.workflow.js";

import ApiError from "../../utils/error-handler.utility.js";
import { getStudentOrder, getStudentPendingOrder } from "./payment.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { PAYMENT_ERROR_MESSAGES, PAYMENT_STATUS } from "./payment.constants.js";
import { ORDER_ERROR_MESSAGES } from "../order/order.constants.js";

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

const processPaymentVerification = async ({ orderId, studentId }) => {
    const order = await getStudentOrder({
        orderId,
        studentId,
    });

    return completeCheckout({
        order,
    });
};

///////////////////////////////////////////////////////////////
// verify successful payment service

const verifySuccessfulPayment = async ({ order }) => {
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
// handle payment webhook

const handleWebhook = async ({ rawBody, signature, timestamp }) => {
    const webhook = await PaymentGatewayService.verifyWebhook({
        rawBody,
        signature,
        timestamp,
    });

    if (webhook.event !== PAYMENT_WEBHOOK_EVENTS.PAYMENT_SUCCESS) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.UNSUPPORTED_WEBHOOK_EVENT,
        });
    }

    if (!webhook.providerOrderId || !webhook.providerPaymentId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.INVALID_WEBHOOK,
        });
    }

    if (webhook.status !== PAYMENT_STATUS.SUCCESS) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.INVALID_WEBHOOK,
        });
    }

    const order = await orderRepository.findOrderById({
        orderId: webhook.providerOrderId,
    });

    if (!order) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PAYMENT_ERROR_MESSAGES.ORDER_NOT_FOUND,
        });
    }

    return completeCheckout({
        order,
    });
};

///////////////////////////////////////////////////////////////
// exports

export {
    createPayment,
    processPaymentVerification,
    verifySuccessfulPayment,
    handleWebhook,
};
