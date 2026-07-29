import rateLimit from "express-rate-limit";
import formatDuration from "../../utils/time-formatter.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { RATE_LIMITER_OPTIONS } from "./ratelimit.constants.js";

///////////////////////////////////////////////////////////////
// shared response handler for all rate limiter

const rateLimitResponse = (req, res, message) => {
    return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
        message,
        errors: [],
        timestamp: new Date().toISOString(),
    });
};

///////////////////////////////////////////////////////////////
// create rate limiter

const createRateLimiter = ({ window, limit, resource, skip }) => {
    return rateLimit({
        windowMs: window,
        limit,

        ...RATE_LIMITER_OPTIONS,

        skip,

        handler: (req, res) => {
            return rateLimitResponse(
                req,
                res,
                `Too many attempts for ${resource}. Please try again in ${formatDuration(window)}.`
            );
        },
    });
};

///////////////////////////////////////////////////////////////
// exports

export default createRateLimiter;
