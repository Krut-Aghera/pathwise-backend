import * as paymentService from "./payment.service.js";
import { completeCheckout } from "../../workflow/checkout/chekout.workflow.js";

import ApiResponse from "../../utils/response-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";

import { PAYMENT_SUCCESS_MESSAGES } from "./payment.constants.js";
import { PAYMENT_WEBHOOK_HEADERS } from "../../services/payment/payment-service.constants.js";

///////////////////////////////////////////////////////////////
// create payment controller

const createPayment = async (req, res) => {
    const providerOrder = await paymentService.createPayment({
        orderId: req.params.orderId,
        studentId: req.user._id,
        studentEmail: req.user.email,
    });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.CREATED,
            message: PAYMENT_SUCCESS_MESSAGES.CREATED,
            data: providerOrder,
        })
    );
};

///////////////////////////////////////////////////////////////
// verify payment controller

const verifyPayment = async (req, res) => {
    const { payment, order, enrollment } =
        await paymentService.processPaymentVerification({
            orderId: req.params.orderId,
            studentId: req.user._id,
        });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: PAYMENT_SUCCESS_MESSAGES.VERIFIED,
            data: {
                payment,
                order,
                enrollment,
            },
        })
    );
};

///////////////////////////////////////////////////////////////
// payment webhook controller

const handleWebhook = async (req, res) => {
    await paymentService.handleWebhook({
        rawBody: req.rawBody,
        signature: req.headers[PAYMENT_WEBHOOK_HEADERS.SIGNATURE],
        timestamp: req.headers[PAYMENT_WEBHOOK_HEADERS.TIMESTAMP],
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: PAYMENT_SUCCESS_MESSAGES.WEBHOOK_RECEIVED,
        })
    );
};
///////////////////////////////////////////////////////////////
// exports

export { createPayment, verifyPayment, handleWebhook };
