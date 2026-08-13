import * as orderRepository from "../order/order.repository.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import {
    ORDER_ERROR_MESSAGES,
    ORDER_STATUS,
} from "../order/order.constants.js";

///////////////////////////////////////////////////////////////
// get student pending order or throw error if not found

const getStudentPendingOrder = async ({ orderId, studentId }) => {
    const order = await orderRepository.findStudentCurrentOrder({
        orderId,
        studentId,
    });

    if (!order) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: ORDER_ERROR_MESSAGES.ORDER_NOT_FOUND,
        });
    }

    if (order.status !== ORDER_STATUS.PENDING) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: ORDER_ERROR_MESSAGES.ORDER_NOT_PENDING,
        });
    }

    return order;
};

///////////////////////////////////////////////////////////////
// get student order

const getStudentOrder = async ({ orderId, studentId }) => {
    const order = await orderRepository.findStudentCurrentOrder({
        orderId,
        studentId,
    });

    if (!order) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: ORDER_ERROR_MESSAGES.ORDER_NOT_FOUND,
        });
    }

    return order;
};

///////////////////////////////////////////////////////////////
// exports

export { getStudentPendingOrder, getStudentOrder };
