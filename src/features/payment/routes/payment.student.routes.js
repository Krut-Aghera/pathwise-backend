import express from "express";
import * as paymentControllers from "../payment.controllers.js";
import * as paymentRatelimiter from "../../../middlewares/ratelimiter/limiters/payment.ratelimit.js";
import studentAuthMiddleware from "../../../middlewares/auth/student-auth.middleware.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import { validateMongoIdParam } from "../../../validations/common.validators.js";

///////////////////////////////////////////////////////////////
// create router

const paymentStudentRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/payments/orders/:orderId
// Creates a payment session for the authenticated student.

paymentStudentRouter.post(
    "/orders/:orderId",
    paymentRatelimiter.createPaymentRateLimiter,
    ...studentAuthMiddleware,
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

paymentStudentRouter.post(
    "/orders/:orderId/verify",
    paymentRatelimiter.verifyPaymentRateLimiter,
    ...studentAuthMiddleware,
    validateMongoIdParam({
        paramName: "orderId",
        fieldName: "Order ID",
    }),
    validationEngine,
    paymentControllers.verifyPayment
);

///////////////////////////////////////////////////////////////
// export

export default paymentStudentRouter;
