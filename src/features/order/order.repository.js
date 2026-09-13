import Order from "./order.model.js";
import { ORDER_STATUS } from "./order.constants.js";

///////////////////////////////////////////////////////////////
// create order

const createOrder = async ({ orderPayload }) => {
    const order = await Order.create(orderPayload);
    await order.populate("course");
    return order;
};

///////////////////////////////////////////////////////////////
// save order

const saveOrder = ({ order, validateBeforeSave = false }) => {
    return order.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// claim payment creation

const claimPaymentCreation = async ({ orderId, studentId, lockUntil }) => {
    return Order.findOneAndUpdate(
        {
            _id: orderId,
            student: studentId,
            status: ORDER_STATUS.PENDING,
            providerOrderId: null,

            $or: [
                {
                    paymentCreationLockUntil: null,
                },
                {
                    paymentCreationLockUntil: {
                        $lte: new Date(),
                    },
                },
            ],
        },
        {
            $set: {
                paymentCreationLockUntil: lockUntil,
            },
        },
        {
            new: true,
        }
    );
};

///////////////////////////////////////////////////////////////
// find order by id

const findOrderById = ({ orderId }) => {
    return Order.findById(orderId);
};

/////////////////////////////////////////////////////////////////////////////
// find order by provider order id

const findOrderByProviderOrderId = ({ providerOrderId }) => {
    return Order.findOne({
        providerOrderId,
    });
};

///////////////////////////////////////////////////////////////
// find order by order id and student id

const findStudentCurrentOrder = ({ orderId, studentId }) => {
    return Order.findOne({
        _id: orderId,
        student: studentId,
    });
};

///////////////////////////////////////////////////////////////
// find pending order by student and course

const findPendingOrderByStudentAndCourse = ({ studentId, courseId }) => {
    return Order.findOne({
        student: studentId,
        course: courseId,
        status: ORDER_STATUS.PENDING,
    });
};

///////////////////////////////////////////////////////////////
// exports

export {
    createOrder,
    saveOrder,
    claimPaymentCreation,
    findOrderById,
    findOrderByProviderOrderId,
    findStudentCurrentOrder,
    findPendingOrderByStudentAndCourse,
};
