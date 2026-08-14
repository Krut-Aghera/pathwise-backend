import crypto from "crypto";
import axios from "axios";

import PaymentContract from "./payment.contract.js";
import cashfreeConfig from "./payment-service.config.js";

///////////////////////////////////////////////////////////////
// cashfree provider class

class CashfreeProvider extends PaymentContract {
    constructor(config) {
        super();

        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.apiVersion = config.apiVersion;
        this.baseUrl = config.baseUrl;

        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            headers: {
                "Content-Type": "application/json",
                "x-client-id": this.clientId,
                "x-client-secret": this.clientSecret,
                "x-api-version": this.apiVersion,
            },
            timeout: config.timeout,
        });
    }

    // cashfree request

    async request({ method, path, body }) {
        const response = await this.httpClient({
            method,
            url: path,
            data: body,
        });

        return response.data;
    }

    // cashfree create order

    async createOrder({
        orderId,
        amount,
        currency,
        customerId,
        customerEmail,
    }) {
        const payload = {
            order_id: orderId,
            order_amount: amount,
            order_currency: currency,

            customer_details: {
                customer_id: customerId,
                customer_email: customerEmail,
            },
        };

        const response = await this.request({
            method: "POST",
            path: "/orders",
            body: payload,
        });

        return {
            providerOrderId: response.cf_order_id,
            orderId: response.order_id,
            paymentSessionId: response.payment_session_id,
            status: response.order_status,
        };
    }

    // cashfree get payments for order

    async getPaymentsForOrder({ orderId }) {
        const response = await this.request({
            method: "GET",
            path: `/orders/${orderId}/payments`,
        });

        return response;
    }

    // cashfree get payment by id

    async getPaymentById({ orderId, paymentId }) {
        const response = await this.request({
            method: "GET",
            path: `/orders/${orderId}/payments/${paymentId}`,
        });

        return response;
    }

    // cashfree verify webhook

    async verifyWebhook({ rawBody, signature, timestamp }) {
        if (!rawBody || !signature || !timestamp) {
            throw new Error("Invalid Cashfree webhook request");
        }

        const signatureData = `${timestamp}${rawBody}`;

        const generatedSignature = crypto
            .createHmac("sha256", this.clientSecret)
            .update(signatureData)
            .digest("base64");

        const expectedSignature = Buffer.from(generatedSignature);
        const receivedSignature = Buffer.from(signature);

        if (
            expectedSignature.length !== receivedSignature.length ||
            !crypto.timingSafeEqual(expectedSignature, receivedSignature)
        ) {
            throw new Error("Invalid Cashfree webhook signature");
        }

        let payload;

        try {
            payload = JSON.parse(rawBody);
        } catch {
            throw new Error("Invalid Cashfree webhook payload");
        }

        return {
            event: payload.type,
            providerOrderId: payload.data?.order?.order_id,
            providerPaymentId: payload.data?.payment?.cf_payment_id,
            status: payload.data?.payment?.payment_status,
        };
    }
}

///////////////////////////////////////////////////////////////
// instance

const paymentProvider = new CashfreeProvider(cashfreeConfig);

///////////////////////////////////////////////////////////////
// export

export default paymentProvider;
