import Payment from "../../src/features/payment/payment.model.js";
import { ORDER_CURRENCY } from "../../src/features/order/order.constants.js";
import {
    PAYMENT_METHOD,
    PAYMENT_PROVIDER,
    PAYMENT_STATUS,
} from "../../src/features/payment/payment.constants.js";

///////////////////////////////////////////////////////////////
// create test payment

const createTestPayment = async ({ orderId, studentId, amount }) => {
    return await Payment.create({
        order: orderId,
        student: studentId,
        amount,
        currency: ORDER_CURRENCY,
        method: PAYMENT_METHOD.CREDIT_CARD,
        provider: PAYMENT_PROVIDER.CASHFREE,
        providerOrderId: `test-provider-order-${Date.now()}`,
        providerPaymentId: `test-provider-payment-${Date.now()}`,
        status: PAYMENT_STATUS.SUCCESS,
        paidAt: Date.now(),
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestPayment };
