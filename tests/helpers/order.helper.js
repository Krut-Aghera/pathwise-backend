import Order from "../../src/features/order/order.model.js";
import {
    ORDER_CURRENCY,
    ORDER_STATUS,
} from "../../src/features/order/order.constants.js";

///////////////////////////////////////////////////////////////
// create test order

const createTestOrder = async ({
    studentId,
    courseId,
    amount,
    status = ORDER_STATUS.PENDING,
    expiresAt = new Date(Date.now() + 15 * 60 * 1000),
    providerOrderId = null,
}) => {
    return await Order.create({
        student: studentId,
        course: courseId,
        amount,
        currency: ORDER_CURRENCY,
        status,
        expiresAt,
        providerOrderId,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestOrder };
