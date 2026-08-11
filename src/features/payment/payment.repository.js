import Payment from "./payment.model.js";

///////////////////////////////////////////////////////////////
// create payment

const createPayment = ({ paymentPayload }) => {
    return Payment.create(paymentPayload);
};

///////////////////////////////////////////////////////////////
// save payment

const savePayment = ({ payment, validateBeforeSave = false }) => {
    return payment.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// find payment by id

const findPaymentById = ({ paymentId }) => {
    return Payment.findById(paymentId);
};

///////////////////////////////////////////////////////////////
// find payments by order

const findPaymentsByOrder = ({ orderId }) => {
    return Payment.find({
        order: orderId,
    });
};

///////////////////////////////////////////////////////////////
// find payment by provider order id

const findPaymentByProviderOrderId = ({ provider, providerOrderId }) => {
    return Payment.findOne({
        provider,
        providerOrderId,
    });
};

///////////////////////////////////////////////////////////////
// find payment by provider payment id

const findPaymentByProviderPaymentId = ({ provider, providerPaymentId }) => {
    return Payment.findOne({
        provider,
        providerPaymentId,
    });
};

///////////////////////////////////////////////////////////////
// exports

export {
    createPayment,
    savePayment,
    findPaymentById,
    findPaymentsByOrder,
    findPaymentByProviderOrderId,
    findPaymentByProviderPaymentId,
};
