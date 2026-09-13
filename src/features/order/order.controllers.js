import * as orderService from "./order.service.js";
import ApiResponse from "../../utils/response-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import {
    ORDER_ALLOWED_FIELDS,
    ORDER_SUCCESS_MESSAGES,
} from "./order.constants.js";

///////////////////////////////////////////////////////////////
// create order controller

const createOrder = async (req, res) => {
    const orderData = ORDER_ALLOWED_FIELDS.reduce((acc, key) => {
        if (req.body[key] !== undefined) {
            acc[key] = req.body[key];
        }
        return acc;
    }, {});

    const order = await orderService.createOrder({
        studentId: req.user._id,
        orderData,
    });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.CREATED,
            message: ORDER_SUCCESS_MESSAGES.CREATED,
            data: order,
        })
    );
};

///////////////////////////////////////////////////////////////
// cancel order controller

const cancelOrder = async (req, res) => {
    await orderService.cancelOrder({
        studentId: req.user._id,
        orderId: req.params.orderId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ORDER_SUCCESS_MESSAGES.CANCELLED,
        })
    );
};

///////////////////////////////////////////////////////////////////////////////
// fetch student order controller

const fetchStudentOrder = async (req, res) => {
    const order = await orderService.fetchStudentOrder({
        studentId: req.user._id,
        orderId: req.params.orderId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ORDER_SUCCESS_MESSAGES.FETCHED,
            data: order,
        })
    );
};

///////////////////////////////////////////////////////////////
// exports

export { createOrder, cancelOrder, fetchStudentOrder };
