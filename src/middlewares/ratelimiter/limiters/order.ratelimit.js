import { ORDER_RT } from "../ratelimit.constants.js";
import createRateLimiter from "../ratelimit.utility.js";

///////////////////////////////////////////////////////////////
// create order limiter

const createOrderRateLimiter = createRateLimiter({
    window: ORDER_RT.CREATE.WINDOW_MS,
    limit: ORDER_RT.CREATE.LIMIT,
    resource: "order creation",
});

///////////////////////////////////////////////////////////////
// cancel order limiter

const cancelOrderRateLimiter = createRateLimiter({
    window: ORDER_RT.CANCEL.WINDOW_MS,
    limit: ORDER_RT.CANCEL.LIMIT,
    resource: "order cancellation",
});

///////////////////////////////////////////////////////////////
// exports

export { createOrderRateLimiter, cancelOrderRateLimiter };
