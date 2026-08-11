///////////////////////////////////////////////////////////////
// payment provider interface class

class PaymentProvider {
    // create payment order

    async createOrder() {
        throw new Error("PaymentProvider.createOrder() must be implemented");
    }

    // get payments for order

    async getPaymentsForOrder() {
        throw new Error(
            "PaymentProvider.getPaymentsForOrder() must be implemented"
        );
    }

    // get payment by provider payment ID

    async getPaymentById() {
        throw new Error("PaymentProvider.getPaymentById() must be implemented");
    }
}

///////////////////////////////////////////////////////////////
// export

export default PaymentProvider;
