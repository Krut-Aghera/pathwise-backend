import express from "express";
import * as paymentControllers from "../payment.controllers.js";
import * as paymentRatelimiter from "../../../middlewares/ratelimiter/limiters/payment.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import { userAuthEngine } from "../../../middlewares/auth/auth.middleware.engines.js";

///////////////////////////////////////////////////////////////
// create router

const paymentAuthenticatedUser = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/payments/orders/:orderId
// Creates a payment session for the authenticated student.

paymentAuthenticatedUser.post(
    "/orders/:orderId",
    paymentRatelimiter.createPaymentRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "orderId",
        fieldName: "Order ID",
    }),
    validationEngine,
    paymentControllers.createPayment
);

///////////////////////////////////////////////////////////////
// POST /api/v1/payments/orders/:orderId/verify
// Verifies the payment and completes checkout for the authenticated student.

paymentAuthenticatedUser.post(
    "/orders/:orderId/verify",
    paymentRatelimiter.verifyPaymentRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "orderId",
        fieldName: "Order ID",
    }),
    validationEngine,
    paymentControllers.verifyPayment
);

///////////////////////////////////////////////////////////////
// export

export default paymentAuthenticatedUser;
