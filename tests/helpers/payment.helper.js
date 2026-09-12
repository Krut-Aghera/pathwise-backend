import Payment from "../../src/features/payment/payment.model.js";
import { ORDER_CURRENCY } from "../../src/features/order/order.constants.js";
import {
    PAYMENT_METHOD,
    PAYMENT_PROVIDER,
    PAYMENT_STATUS,
} from "../../src/features/payment/payment.constants.js";

///////////////////////////////////////////////////////////////
// create test payment

const createTestPayment = async ({
    orderId,
    studentId,
    amount,
    providerOrderId = `test-provider-order-${Date.now()}`,
    providerPaymentId = `test-provider-payment-${Date.now()}`,
    status = PAYMENT_STATUS.SUCCESS,
}) => {
    return await Payment.create({
        order: orderId,
        student: studentId,
        amount,
        currency: ORDER_CURRENCY,
        method: PAYMENT_METHOD.CARD,
        provider: PAYMENT_PROVIDER.RAZORPAY,
        providerOrderId,
        providerPaymentId,
        status,
        paidAt: status === PAYMENT_STATUS.SUCCESS ? new Date() : null,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestPayment };
