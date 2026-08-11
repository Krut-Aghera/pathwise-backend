///////////////////////////////////////////////////////////////
// payment success messages

const PAYMENT_SUCCESS_MESSAGES = Object.freeze({
    CREATED: "Payment created successfully.",
    VERIFIED: "Payment verified successfully.",
});

///////////////////////////////////////////////////////////////
// payment error messages

const PAYMENT_ERROR_MESSAGES = Object.freeze({
    ORDER_NOT_FOUND: "Order not found.",
    ORDER_NOT_PENDING: "Only pending orders can be paid.",
    INVALID_ORDER_OWNER: "You are not authorized to make this payment.",

    PAYMENT_NOT_FOUND: "Payment not found.",
    PAYMENT_ALREADY_PROCESSED: "Payment has already been processed.",
    INVALID_PAYMENT: "Invalid payment.",

    PAYMENT_VERIFICATION_FAILED: "Payment verification failed.",
    PAYMENT_AMOUNT_MISMATCH: "Payment amount does not match the order amount.",
    PAYMENT_CURRENCY_MISMATCH:
        "Payment currency does not match the order currency.",
    PAYMENT_PROVIDER_ERROR: "Payment provider request failed.",
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
    CASHFREE: "CASHFREE",
};

///////////////////////////////////////////////////////////////
// payment method

const PAYMENT_METHOD = {
    PREPAID_CARD: "prepaid_card",
    UPI_PPI_OFFLINE: "upi_ppi_offline",
    CASH: "cash",
    UPI_CREDIT_CARD: "upi_credit_card",
    PAYPAL: "paypal",
    NET_BANKING: "net_banking",
    CARDLESS_EMI: "cardless_emi",
    CREDIT_CARD: "credit_card",
    BANK_TRANSFER: "bank_transfer",
    PAY_LATER: "pay_later",
    DEBIT_CARD_EMI: "debit_card_emi",
    DEBIT_CARD: "debit_card",
    WALLET: "wallet",
    UPI_PPI: "upi_ppi",
    UPI: "upi",
    CREDIT_CARD_EMI: "credit_card_emi",
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
