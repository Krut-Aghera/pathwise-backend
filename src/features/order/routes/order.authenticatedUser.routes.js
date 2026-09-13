import express from "express";
import * as orderControllers from "../order.controllers.js";
import * as orderValidators from "../order.validators.js";
import * as orderRatelimiter from "../../../middlewares/ratelimiter/limiters/order.ratelimit.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";
import { userAuthEngine } from "../../../middlewares/auth/auth.middleware.engines.js";

///////////////////////////////////////////////////////////////
// create router

const orderAuthenticatedUser = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/orders/students
// Creates a pending order for the authenticated student.

orderAuthenticatedUser.post(
    "/",
    orderRatelimiter.createOrderRateLimiter,
    ...userAuthEngine,
    orderValidators.createOrderValidator,
    validationEngine,
    orderControllers.createOrder
);

///////////////////////////////////////////////////////////////
// GET /api/v1/orders/students/:orderId
// Fetches the specified order for the authenticated student.

orderAuthenticatedUser.get(
    "/:orderId",
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "orderId",
        fieldName: "Order ID",
    }),
    validationEngine,
    orderControllers.fetchStudentOrder
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/orders/students/:orderId/cancel
// Cancels the specified pending order for the authenticated student.

orderAuthenticatedUser.patch(
    "/:orderId/cancel",
    orderRatelimiter.cancelOrderRateLimiter,
    ...userAuthEngine,
    validateMongoIdParam({
        paramName: "orderId",
        fieldName: "Order ID",
    }),
    validationEngine,
    orderControllers.cancelOrder
);

///////////////////////////////////////////////////////////////
// export

export default orderAuthenticatedUser;
