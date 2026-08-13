import * as paymentService from "./payment.service.js";
import { completeCheckout } from "../../workflow/checkout/chekout.service.js";

import ApiResponse from "../../utils/response-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";

import { PAYMENT_SUCCESS_MESSAGES } from "./payment.constants.js";

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
    const { payment, order, enrollment } = await completeCheckout({
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
// exports

export { createPayment, verifyPayment };
