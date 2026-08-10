import Order from "./order.model.js";

///////////////////////////////////////////////////////////////
// create order

const createOrder = ({ orderPayload }) => {
    return Order.create(orderPayload);
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

///////////////////////////////////////////////////////////////
// exports

export { createOrder, saveOrder, findOrderById };
