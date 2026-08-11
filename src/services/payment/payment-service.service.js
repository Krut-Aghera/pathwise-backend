import cashfreeProvider from "./payment-service.provider.js";

import * as paymentRepository from "../../features/payment/payment.repository.js";

import {
    PAYMENT_PROVIDER,
    PAYMENT_STATUS,
} from "../../features/payment/payment.constants.js";

///////////////////////////////////////////////////////////////
// payment service class

class PaymentService {
    constructor(provider) {
        this.provider = provider;
    }

    // create payment order

    async createPaymentOrder({ order, student }) {
        const cashfreeOrder = await this.provider.createOrder({
            orderId: order._id.toString(),
            amount: order.amount,
            currency: order.currency,
            customerId: student._id.toString(),
        });

        return {
            providerOrderId: cashfreeOrder.providerOrderId,
            paymentSessionId: cashfreeOrder.paymentSessionId,
            status: cashfreeOrder.status,
        };
    }

    // sync payment attempts for order

    async syncPaymentsForOrder({ order }) {
        const payments = await this.provider.getPaymentsForOrder({
            orderId: order._id.toString(),
        });

        for (const paymentData of payments) {
            const existingPayment =
                await paymentRepository.findPaymentByProviderPaymentId({
                    provider: PAYMENT_PROVIDER.CASHFREE,
                    providerPaymentId: paymentData.cf_payment_id,
                });

            const paymentPayload = {
                order: order._id,
                student: order.student,

                amount: paymentData.payment_amount,
                currency: paymentData.payment_currency,

                provider: PAYMENT_PROVIDER.CASHFREE,
                providerOrderId: paymentData.order_id,
                providerPaymentId: paymentData.cf_payment_id,

                method: paymentData.payment_group,

                status: paymentData.payment_status,

                paidAt:
                    paymentData.payment_status === PAYMENT_STATUS.SUCCESS
                        ? paymentData.payment_completion_time ||
                          paymentData.payment_time ||
                          null
                        : null,

                failureReason:
                    paymentData.payment_status === PAYMENT_STATUS.SUCCESS
                        ? null
                        : paymentData.payment_message || null,
            };

            if (existingPayment) {
                Object.assign(existingPayment, paymentPayload);

                await paymentRepository.savePayment({
                    payment: existingPayment,
                });

                continue;
            }

            await paymentRepository.createPayment({
                paymentPayload,
            });
        }

        return payments;
    }
}

///////////////////////////////////////////////////////////////
// instance

const paymentService = new PaymentService(cashfreeProvider);

///////////////////////////////////////////////////////////////
// export

export default paymentService;
