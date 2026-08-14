///////////////////////////////////////////////////////////////
// payment provider

const PAYMENT_SERVICE_PROVIDER = {
    CASHFREE: "CASHFREE",
};

///////////////////////////////////////////////////////////////
// payment webhook 

const PAYMENT_WEBHOOK_EVENTS = Object.freeze({
    PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
});

const PAYMENT_WEBHOOK_HEADERS = {
    SIGNATURE: "x-webhook-signature",
    TIMESTAMP: "x-webhook-timestamp",
};

///////////////////////////////////////////////////////////////
// cashfree api version

const CASHFREE_API_VERSION = "2025-01-01";

///////////////////////////////////////////////////////////////
// cashfree base url

const CASHFREE_API_BASE_URL = "https://sandbox.cashfree.com/pg";

///////////////////////////////////////////////////////////////
// exports

export {
    PAYMENT_SERVICE_PROVIDER,
    CASHFREE_API_VERSION,
    CASHFREE_API_BASE_URL,
    PAYMENT_WEBHOOK_EVENTS,
    PAYMENT_WEBHOOK_HEADERS
};
