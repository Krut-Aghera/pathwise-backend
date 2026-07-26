import createRateLimiter from "../ratelimit.utility.js";
import { RATE_LIMIT } from "../ratelimit.constants.js";

///////////////////////////////////////////////////////////////
// global limiter

export const globalRateLimiter = createRateLimiter({
    window: RATE_LIMIT.API.GLOBAL.WINDOW_MS,
    limit: RATE_LIMIT.API.GLOBAL.LIMIT,
    resource: "API requests",

    skip: (req) => req.method === "OPTIONS",
});
