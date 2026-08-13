import Payment from "./payment.model.js";

///////////////////////////////////////////////////////////////
// create payment

const createPayment = ({ paymentPayload }) => {
    return Payment.create(paymentPayload);
};

///////////////////////////////////////////////////////////////
// find successful payment by order id

const findSuccessfulPaymentByOrderId = ({ orderId }) => {
    return Payment.findOne({
        order: orderId,
        status: PAYMENT_STATUS.SUCCESS,
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
    findSuccessfulPaymentByOrderId,
    findPaymentByProviderPaymentId,
};
