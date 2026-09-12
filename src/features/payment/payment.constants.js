///////////////////////////////////////////////////////////////
// payment success messages

const PAYMENT_SUCCESS_MESSAGES = Object.freeze({
    CREATED: "Payment created successfully.",
    VERIFIED: "Payment verified successfully.",
    WEBHOOK_RECEIVED: "Payment webhook received successfully.",
});

///////////////////////////////////////////////////////////////
// payment error messages

const PAYMENT_ERROR_MESSAGES = Object.freeze({
    ORDER_NOT_FOUND: "Order not found.",
    ORDER_NOT_PENDING: "Only pending orders can be paid.",
    INVALID_ORDER_OWNER: "You are not authorized to make this payment.",

    PAYMENT_NOT_FOUND: "Payment not found.",
    PAYMENT_ALREADY_INITIATED:
        "Payment has already been initialized for this order. Please retry the checkout.",
    PAYMENT_CURRENCY_MISMATCH:
        "Payment currency does not match the order currency.",
    PAYMENT_AMOUNT_MISMATCH: "Payment amount does not match the order amount.",
    INVALID_PAYMENT: "Invalid payment.",

    PAYMENT_VERIFICATION_FAILED:
        "Payment verification failed. Payment not completed",
    PAYMENT_PROVIDER_ERROR: "Payment provider request failed.",

    UNSUPPORTED_WEBHOOK_EVENT: "Unsupported payment webhook event.",
    INVALID_WEBHOOK: "Invalid payment webhook.",
});

///////////////////////////////////////////////////////////////
// payment status

const PAYMENT_STATUS = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    NOT_ATTEMPTED: "NOT_ATTEMPTED",
    USER_DROPPED: "USER_DROPPED",
    VOID: "VOID",
    CANCELLED: "CANCELLED",
};

///////////////////////////////////////////////////////////////
// payment provider

const PAYMENT_PROVIDER = {
    RAZORPAY: "RAZORPAY",
};

///////////////////////////////////////////////////////////////
// payment method

const PAYMENT_METHOD = {
    CARD: "card",
    UPI: "upi",
    NETBANKING: "netbanking",
    WALLET: "wallet",
    EMI: "emi",
};

///////////////////////////////////////////////////////////////
// exports

export {
    PAYMENT_SUCCESS_MESSAGES,
    PAYMENT_ERROR_MESSAGES,
    PAYMENT_STATUS,
    PAYMENT_PROVIDER,
    PAYMENT_METHOD,
};
