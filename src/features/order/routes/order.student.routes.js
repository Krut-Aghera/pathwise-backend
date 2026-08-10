import express from "express";
import * as orderControllers from "../order.controllers.js";
import * as orderValidators from "../order.validators.js";
import * as orderRateLimiter from "../../../middlewares/ratelimiter/limiters/order.ratelimit.js";
import studentAuthMiddleware from "../../../middlewares/auth/student-auth.middleware.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import { validateMongoIdParam } from "../../../validations/common.validators.js";

///////////////////////////////////////////////////////////////
// create router

const orderStudentRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/orders/students
// Creates a pending order for the authenticated student.

orderStudentRouter.post(
    "/",
    orderRateLimiter.createOrderRateLimiter,
    ...studentAuthMiddleware,
    orderValidators.createOrderValidator,
    validationEngine,
    orderControllers.createOrder
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/orders/students/:orderId/cancel
// Cancels the specified pending order for the authenticated student.

orderStudentRouter.patch(
    "/:orderId/cancel",
    orderRateLimiter.cancelOrderRateLimiter,
    ...studentAuthMiddleware,
    validateMongoIdParam({
        paramName: "orderId",
        fieldName: "Order ID",
    }),
    validationEngine,
    orderControllers.cancelOrder
);

///////////////////////////////////////////////////////////////
// export

export default orderStudentRouter;
