import express from "express";
import * as paymentControllers from "../payment.controllers.js";
import * as paymentRatelimiter from "../../../middlewares/ratelimiter/limiters/payment.ratelimit.js";
import studentAuthEngine from "../../../middlewares/auth/engines/student-auth.engine.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const paymentStudentRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/payments/orders/:orderId
// Creates a payment session for the authenticated student.

paymentStudentRouter.post(
    "/orders/:orderId",
    paymentRatelimiter.createPaymentRateLimiter,
    ...studentAuthEngine,
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
    ...studentAuthEngine,
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
