import paymentProvider from "./payment.provider.js";

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

    // ---------- create payment order  ---------- //

    async createPaymentOrder({ order }) {
        const razorpayOrder = await this.provider.createOrder({
            orderId: order._id.toString(),
            amount: order.amount,
            currency: order.currency,
        });

        return {
            providerOrderId: razorpayOrder.providerOrderId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            status: razorpayOrder.status,
        };
    }

    // ---------- verify payment signature  ---------- //

    async verifyPaymentSignature({
        providerOrderId,
        providerPaymentId,
        signature,
    }) {
        return this.provider.verifyPaymentSignature({
            orderId: providerOrderId,
            paymentId: providerPaymentId,
            signature,
        });
    }

    // ---------- get payment by ID  ---------- //

    async getPaymentById({ providerPaymentId }) {
        return this.provider.getPaymentById({
            paymentId: providerPaymentId,
        });
    }

    // ---------- sync successful payment for order  ---------- //

    async syncSuccessfulPaymentForOrder({ order, providerPaymentId }) {
        const razorpayPayment = await this.provider.getPaymentById({
            paymentId: providerPaymentId,
        });

        if (!razorpayPayment) {
            return null;
        }

        if (razorpayPayment.status !== "captured") {
            return null;
        }

        if (razorpayPayment.order_id !== order.providerOrderId) {
            return null;
        }

        const existingPayment =
            await paymentRepository.findPaymentByProviderPaymentId({
                provider: PAYMENT_PROVIDER.RAZORPAY,
                providerPaymentId: razorpayPayment.id,
            });

        if (existingPayment) {
            return existingPayment;
        }

        const paymentPayload = {
            order: order._id,
            student: order.student,

            amount: razorpayPayment.amount / 100,
            currency: razorpayPayment.currency,

            method: razorpayPayment.method || null,

            provider: PAYMENT_PROVIDER.RAZORPAY,
            providerOrderId: razorpayPayment.order_id,
            providerPaymentId: razorpayPayment.id,

            status: PAYMENT_STATUS.SUCCESS,

            paidAt: razorpayPayment.created_at
                ? new Date(razorpayPayment.created_at * 1000)
                : null,
        };

        return paymentRepository.createPayment({
            paymentPayload,
        });
    }

    // --------- verify webhook  ---------- //

    async verifyWebhook({ rawBody, signature }) {
        return this.provider.verifyWebhook({
            rawBody,
            signature,
        });
    }
}

///////////////////////////////////////////////////////////////
// instance

const PaymentGatewayService = new PaymentGateway(paymentProvider);

///////////////////////////////////////////////////////////////
// export

export default PaymentGatewayService;
