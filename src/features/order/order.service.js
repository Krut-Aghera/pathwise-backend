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
import { toSubunit } from "../../utils/money-subunit.utility.js";

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

    const existingPendingOrder =
        await orderRepository.findPendingOrderByStudentAndCourse({
            studentId,
            courseId,
        });

    if (existingPendingOrder) {
        if (existingPendingOrder.expiresAt > new Date()) {
            await existingPendingOrder.populate("course");

            return existingPendingOrder;
        }

        existingPendingOrder.status = ORDER_STATUS.EXPIRED;

        await orderRepository.saveOrder({
            order: existingPendingOrder,
        });
    }

    const orderPayload = {
        student: studentId,
        course: course._id,
        amount: toSubunit({
            amount: course.price,
            currency: ORDER_CURRENCY,
        }),
        currency: ORDER_CURRENCY,
        status: ORDER_STATUS.PENDING,
        expiresAt: getExpiry(15),
    };

    try {
        return await orderRepository.createOrder({
            orderPayload,
        });
    } catch (error) {
        if (error?.code !== 11000) {
            throw error;
        }

        const pendingOrder =
            await orderRepository.findPendingOrderByStudentAndCourse({
                studentId,
                courseId,
            });

        if (!pendingOrder) {
            throw error;
        }

        await pendingOrder.populate("course");

        return pendingOrder;
    }
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

    // Idempotent cancellation.
    // If the order is already cancelled, cancellation
    // is considered successful.
    if (order.status === ORDER_STATUS.CANCELLED) {
        return order;
    }

    // Only a pending order can transition to cancelled.
    if (order.status !== ORDER_STATUS.PENDING) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: ORDER_ERROR_MESSAGES.ORDER_NOT_PENDING,
        });
    }

    // Pending order has expired.
    if (order.expiresAt <= new Date()) {
        order.status = ORDER_STATUS.EXPIRED;

        await orderRepository.saveOrder({
            order,
        });

        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: ORDER_ERROR_MESSAGES.ORDER_EXPIRED,
        });
    }

    order.status = ORDER_STATUS.CANCELLED;

    return orderRepository.saveOrder({
        order,
    });
};

////////////////////////////////////////////////////////////////
// fetch student order service

const fetchStudentOrder = async ({ studentId, orderId }) => {
    const order = await orderRepository.findStudentOrderById({
        studentId,
        orderId,
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

export { createOrder, cancelOrder, fetchStudentOrder };
