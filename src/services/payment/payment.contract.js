///////////////////////////////////////////////////////////////
// payment provider interface class

class PaymentContract {
    // create payment order

    async createOrder() {
        throw new Error("PaymentInterface.createOrder() must be implemented");
    }

    // get payments for order

    async getPaymentsForOrder() {
        throw new Error(
            "PaymentInterface.getPaymentsForOrder() must be implemented"
        );
    }

    // get payment by provider payment ID

    async getPaymentById() {
        throw new Error(
            "PaymentInterface.getPaymentById() must be implemented"
        );
    }

    // verify and parse payment webhook

    async verifyWebhook() {
        throw new Error("PaymentInterface.verifyWebhook() must be implemented");
    }
}

///////////////////////////////////////////////////////////////
// export

export default PaymentContract;
