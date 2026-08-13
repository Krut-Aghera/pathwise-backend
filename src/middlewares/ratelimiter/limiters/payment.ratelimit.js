import { PAYMENT_RT } from "../ratelimit.constants.js";
import createRateLimiter from "../ratelimit.utility.js";

///////////////////////////////////////////////////////////////
// create payment limiter

export const createPaymentRateLimiter = createRateLimiter({
    window: PAYMENT_RT.CREATE.WINDOW_MS,
    limit: PAYMENT_RT.CREATE.LIMIT,
    resource: "payment creation",
});

///////////////////////////////////////////////////////////////
// verify payment limiter

export const verifyPaymentRateLimiter = createRateLimiter({
    window: PAYMENT_RT.VERIFY.WINDOW_MS,
    limit: PAYMENT_RT.VERIFY.LIMIT,
    resource: "payment verification",
});

///////////////////////////////////////////////////////////////
// payment webhook limiter

export const paymentWebhookRateLimiter = createRateLimiter({
    window: PAYMENT_RT.WEBHOOK.WINDOW_MS,
    limit: PAYMENT_RT.WEBHOOK.LIMIT,
    resource: "payment webhook",
});

///////////////////////////////////////////////////////////////
// fetch current payment limiter

export const fetchCurrentPaymentRateLimiter = createRateLimiter({
    window: PAYMENT_RT.FETCH_CURRENT.WINDOW_MS,
    limit: PAYMENT_RT.FETCH_CURRENT.LIMIT,
    resource: "current payment fetch",
});
