import * as orderRepository from "./order.repository.js";
import * as courseRepository from "../course/course.repository.js";
import * as enrollmentRepository from "../enrollment/enrollment.repository.js";

import ApiError from "../../utils/error-handler.utility.js";
import { getExpiry } from "../../utils/token-generator.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { COURSE_ERROR_MESSAGES } from "../course/course.constants.js";
import {
    ORDER_CURRENCY,
    ORDER_ERROR_MESSAGES,
    ORDER_STATUS,
} from "./order.constants.js";
import { ENROLLMENT_ERROR_MESSAGES } from "../enrollment/enrollment.constants.js";

///////////////////////////////////////////////////////////////
// create order service

const createOrder = async ({ studentId, orderData }) => {
    const courseId = orderData.course;

    const course = await courseRepository.findPublishedCourse({ courseId });
    if (!course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: COURSE_ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
    }

    const enrollment = await enrollmentRepository.findEnrollment({
        studentId,
        courseId,
    });

    if (enrollment) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: ENROLLMENT_ERROR_MESSAGES.ALREADY_ENROLLED,
        });
    }

    const orderPayload = {
        student: studentId,
        course: course._id,
        amount: course.amount || course.price,
        currency: ORDER_CURRENCY,
        status: ORDER_STATUS.PENDING,
        expiresAt: getExpiry(15),
    };

    return await orderRepository.createOrder({ orderPayload });
};

///////////////////////////////////////////////////////////////
// cancel order service

const cancelOrder = async ({ studentId, orderId }) => {
    const order = await orderRepository.findOrderById({
        orderId,
    });

    if (!order) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: ORDER_ERROR_MESSAGES.ORDER_NOT_FOUND,
        });
    }

    if (order.student.toString() !== studentId.toString()) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: ORDER_ERROR_MESSAGES.ORDER_ACCESS_DENIED,
        });
    }

    if (
        order.status !== ORDER_STATUS.PENDING ||
        order.expiresAt <= new Date()
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: ORDER_ERROR_MESSAGES.ONLY_PENDING_ORDER_CAN_BE_CANCELLED,
        });
    }

    order.status = ORDER_STATUS.CANCELLED;

    return orderRepository.saveOrder({
        order,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createOrder, cancelOrder };
