import paymentProvider from "./payment-service.provider.js";

import * as paymentRepository from "../../features/payment/payment.repository.js";

import {
    PAYMENT_PROVIDER,
    PAYMENT_STATUS,
} from "../../features/payment/payment.constants.js";

///////////////////////////////////////////////////////////////
// payment gateway class

class PaymentGateway {
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
            customerEmail: student.email,
        });

        return {
            providerOrderId: cashfreeOrder.providerOrderId,
            paymentSessionId: cashfreeOrder.paymentSessionId,
            status: cashfreeOrder.status,
        };
    }

    // sync payment attempts for order

    async syncSuccessfulPaymentForOrder({ order }) {
        const payments = await this.provider.getPaymentsForOrder({
            orderId: order._id.toString(),
        });

        const successfulPayment = payments.find(
            (payment) => payment.payment_status === PAYMENT_STATUS.SUCCESS
        );

        if (!successfulPayment) {
            return null;
        }

        const existingPayment =
            await paymentRepository.findPaymentByProviderPaymentId({
                provider: PAYMENT_PROVIDER.CASHFREE,
                providerPaymentId: successfulPayment.cf_payment_id,
            });

        if (existingPayment) {
            return existingPayment;
        }

        const paymentPayload = {
            order: order._id,
            student: order.student,

            amount: successfulPayment.payment_amount,
            currency: successfulPayment.payment_currency,
            method: successfulPayment.payment_group,

            provider: PAYMENT_PROVIDER.CASHFREE,
            providerOrderId: successfulPayment.order_id,
            providerPaymentId: successfulPayment.cf_payment_id,

            status: PAYMENT_STATUS.SUCCESS,

            paidAt:
                successfulPayment.payment_completion_time ||
                successfulPayment.payment_time ||
                null,
        };

        return paymentRepository.createPayment({
            paymentPayload,
        });
    }
}

///////////////////////////////////////////////////////////////
// instance

const PaymentGatewayService = new PaymentGateway(paymentProvider);

///////////////////////////////////////////////////////////////
// export

export default PaymentGatewayService;
