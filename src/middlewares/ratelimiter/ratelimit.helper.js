import HTTP_STATUS from "../../constants/http-status.js";

///////////////////////////////////////////////////////////////
// shared response handler for all rate limiter

export const rateLimitResponse = (req, res, message) => {
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

export const createRateLimiter = () => {};
