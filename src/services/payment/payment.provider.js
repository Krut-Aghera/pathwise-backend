import crypto from "crypto";
import axios from "axios";

import PaymentContract from "./payment.contract.js";
import razorpayConfig from "./payment-service.config.js";

///////////////////////////////////////////////////////////////
// razorpay provider class

class RazorpayProvider extends PaymentContract {
    constructor(config) {
        super();

        this.keyId = config.keyId;
        this.keySecret = config.keySecret;
        this.baseUrl = config.baseUrl;
        this.webhookSecret = config.webhookSecret;

        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            auth: {
                username: this.keyId,
                password: this.keySecret,
            },
            headers: {
                "Content-Type": "application/json",
            },
            timeout: config.timeout,
        });
    }

    // ---------- razorpay request helper  ---------- //

    async request({ method, path, body }) {
        try {
            const response = await this.httpClient({
                method,
                url: path,
                data: body,
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // ---------- razorpay create order ---------- //

    async createOrder({ orderId, amount, currency }) {
        const amountInSubunit = Number(amount);

        if (!Number.isSafeInteger(amountInSubunit) || amountInSubunit <= 0) {
            throw new Error("Invalid payment amount.");
        }

        const payload = {
            amount: amountInSubunit,
            currency,
            receipt: orderId,
        };

        const response = await this.request({
            method: "POST",
            path: "/v1/orders",
            body: payload,
        });

        return {
            providerOrderId: response.id,
            orderId: response.receipt,
            amount: response.amount,
            currency: response.currency,
            status: response.status,
        };
    }

    // ---------- razorpay get payments for order ---------- //

    async getPaymentsForOrder({ orderId }) {
        const response = await this.request({
            method: "GET",
            path: `/v1/orders/${orderId}/payments`,
        });

        return response.items ?? [];
    }

    // ---------- razorpay get payment by id ---------- //

    async getPaymentById({ paymentId }) {
        return await this.request({
            method: "GET",
            path: `/v1/payments/${paymentId}`,
        });
    }

    // ---------- verify razorpay checkout payment signature  ---------- //

    async verifyPaymentSignature({ orderId, paymentId, signature }) {
        if (!orderId || !paymentId || !signature) {
            throw new Error("Invalid Razorpay payment verification data.");
        }

        const signatureData = `${orderId}|${paymentId}`;

        const generatedSignature = crypto
            .createHmac("sha256", this.keySecret)
            .update(signatureData)
            .digest("hex");

        const expectedSignature = Buffer.from(generatedSignature, "utf8");

        const receivedSignature = Buffer.from(signature, "utf8");

        if (
            expectedSignature.length !== receivedSignature.length ||
            !crypto.timingSafeEqual(expectedSignature, receivedSignature)
        ) {
            throw new Error("Invalid Razorpay payment signature.");
        }

        return true;
    }

    // ---------- verify razorpay webhook  ---------- //
    async verifyWebhook({ rawBody, signature }) {
        if (!rawBody || !signature || !this.webhookSecret) {
            throw new Error("Invalid Razorpay webhook request.");
        }

        const generatedSignature = crypto
            .createHmac("sha256", this.webhookSecret)
            .update(rawBody)
            .digest("hex");

        const expectedSignature = Buffer.from(generatedSignature, "utf8");

        const receivedSignature = Buffer.from(signature, "utf8");

        if (
            expectedSignature.length !== receivedSignature.length ||
            !crypto.timingSafeEqual(expectedSignature, receivedSignature)
        ) {
            throw new Error("Invalid Razorpay webhook signature.");
        }

        let payload;

        try {
            payload = JSON.parse(rawBody);
        } catch {
            throw new Error("Invalid Razorpay webhook payload.");
        }

        const paymentEntity = payload.payload?.payment?.entity;
        const orderEntity = payload.payload?.order?.entity;

        return {
            event: payload.event,

            providerOrderId: orderEntity?.id ?? paymentEntity?.order_id ?? null,

            providerPaymentId: paymentEntity?.id ?? null,

            status: paymentEntity?.status ?? null,

            method: paymentEntity?.method ?? null,
        };
    }
}

///////////////////////////////////////////////////////////////
// instance

const paymentProvider = new RazorpayProvider(razorpayConfig);

///////////////////////////////////////////////////////////////
// export

export default paymentProvider;
