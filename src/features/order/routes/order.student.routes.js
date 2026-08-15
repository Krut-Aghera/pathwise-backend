import express from "express";
import * as orderControllers from "../order.controllers.js";
import * as orderValidators from "../order.validators.js";
import * as orderRatelimiter from "../../../middlewares/ratelimiter/limiters/order.ratelimit.js";
import studentAuthEngine from "../../../middlewares/auth/engines/student-auth.engine.js";
import validationEngine from "../../../middlewares/validation.middleware.js";
import validateMongoIdParam from "../../../validations/mongo-idParam.validator.js";

///////////////////////////////////////////////////////////////
// create router

const orderStudentRouter = express.Router();

///////////////////////////////////////////////////////////////
// POST /api/v1/orders/students
// Creates a pending order for the authenticated student.

orderStudentRouter.post(
    "/",
    orderRatelimiter.createOrderRateLimiter,
    ...studentAuthEngine,
    orderValidators.createOrderValidator,
    validationEngine,
    orderControllers.createOrder
);

///////////////////////////////////////////////////////////////
// PATCH /api/v1/orders/students/:orderId/cancel
// Cancels the specified pending order for the authenticated student.

orderStudentRouter.patch(
    "/:orderId/cancel",
    orderRatelimiter.cancelOrderRateLimiter,
    ...studentAuthEngine,
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
