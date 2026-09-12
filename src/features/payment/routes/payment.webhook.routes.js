import express from "express";

import * as paymentControllers from "../payment.controllers.js";
import * as paymentRatelimiter from "../../../middlewares/ratelimiter/limiters/payment.ratelimit.js";

///////////////////////////////////////////////////////////////
// create router

const paymentWebhookRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/payments/webhooks/razorpay
// Handles Razorpay payment webhooks.

paymentWebhookRouter.post(
    "/razorpay",
    paymentRatelimiter.paymentWebhookRateLimiter,
    paymentControllers.handleWebhook
);

///////////////////////////////////////////////////////////////
// export

export default paymentWebhookRouter;
