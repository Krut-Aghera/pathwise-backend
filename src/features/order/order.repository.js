import Order from "./order.model.js";

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
// exports

export {
    createOrder,
    saveOrder,
    findOrderById,
    findOrderByProviderOrderId,
    findStudentCurrentOrder,
};
