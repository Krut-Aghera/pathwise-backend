///////////////////////////////////////////////////////////////
// payment provider

const PAYMENT_SERVICE_PROVIDER = {
    RAZORPAY: "RAZORPAY",
};

///////////////////////////////////////////////////////////////
// payment webhook

const PAYMENT_WEBHOOK_EVENTS = Object.freeze({
    PAYMENT_SUCCESS: "order.paid",
});

const PAYMENT_WEBHOOK_HEADERS = {
    SIGNATURE: "x-razorpay-signature",
};

///////////////////////////////////////////////////////////////
// razorpay api

const RAZORPAY_API_BASE_URL = "https://api.razorpay.com";

///////////////////////////////////////////////////////////////
// exports

export {
    PAYMENT_SERVICE_PROVIDER,
    RAZORPAY_API_BASE_URL,
    PAYMENT_WEBHOOK_EVENTS,
    PAYMENT_WEBHOOK_HEADERS,
};
