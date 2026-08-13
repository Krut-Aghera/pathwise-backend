import axios from "axios";

import PaymentInterface from "./payment-service.interface.js";
import cashfreeConfig from "./payment-service.config.js";

///////////////////////////////////////////////////////////////
// cashfree provider class

class CashfreeProvider extends PaymentInterface {
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

    // cashfree ger payments for orders

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
}

///////////////////////////////////////////////////////////////
// instance

const paymentProvider = new CashfreeProvider(cashfreeConfig);

///////////////////////////////////////////////////////////////
// export

export default paymentProvider;
