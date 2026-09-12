import * as orderRepository from "../order/order.repository.js";

import PaymentGatewayService from "../../services/payment/payment.layer.js";
import { completeCheckout } from "../../workflow/checkout/chekout.workflow.js";

import ApiError from "../../utils/error-handler.utility.js";
import { getStudentOrder, getStudentPendingOrder } from "./payment.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { PAYMENT_ERROR_MESSAGES, PAYMENT_STATUS } from "./payment.constants.js";

import { PAYMENT_WEBHOOK_EVENTS } from "../../services/payment/payment-service.constants.js";

///////////////////////////////////////////////////////////////
// create payment service

const createPayment = async ({ orderId, studentId }) => {
    const order = await getStudentPendingOrder({
        orderId,
        studentId,
    });

    if (order.providerOrderId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: PAYMENT_ERROR_MESSAGES.PAYMENT_ALREADY_INITIATED,
        });
    }

    const providerOrder = await PaymentGatewayService.createPaymentOrder({
        order,
    });

    order.providerOrderId = providerOrder.providerOrderId;

    await orderRepository.saveOrder({
        order,
    });

    return providerOrder;
};

///////////////////////////////////////////////////////////////
// verify payment service

const processPaymentVerification = async ({
    orderId,
    studentId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
}) => {
    const order = await getStudentOrder({
        orderId,
        studentId,
    });

    if (!order.providerOrderId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,
        });
    }

    if (razorpayOrderId !== order.providerOrderId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.INVALID_PAYMENT,
        });
    }

    try {
        await PaymentGatewayService.verifyPaymentSignature({
            providerOrderId: order.providerOrderId,
            providerPaymentId: razorpayPaymentId,
            signature: razorpaySignature,
        });
    } catch {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: PAYMENT_ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,
        });
    }

    return completeCheckout({
        order,
        providerPaymentId: razorpayPaymentId,
    });
};

///////////////////////////////////////////////////////////////
// verify successful payment service

const verifySuccessfulPayment = async ({ order, providerPaymentId }) => {
    const payment = await PaymentGatewayService.syncSuccessfulPaymentForOrder({
        order,
        providerPaymentId,
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

const handleWebhook = async ({ rawBody, signature }) => {
    const webhook = await PaymentGatewayService.verifyWebhook({
        rawBody,
        signature,
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

    const order = await orderRepository.findOrderByProviderOrderId({
        providerOrderId: webhook.providerOrderId,
    });

    if (!order) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PAYMENT_ERROR_MESSAGES.ORDER_NOT_FOUND,
        });
    }

    return completeCheckout({
        order,
        providerPaymentId: webhook.providerPaymentId,
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
