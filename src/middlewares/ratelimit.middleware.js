import rateLimit from "express-rate-limit";
import HTTP_STATUS from "../constants/http-status.js";
import RATE_LIMIT from "../constants/rate-limit.js";

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
// general API rate limiter

const apiRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.API.WINDOW_MS,
    limit: RATE_LIMIT.API.LIMIT,

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,
    skipFailedRequests: false,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many requests from this IP. Please try again after 15 minutes."
        );
    },
});

///////////////////////////////////////////////////////////////
// login rate limiter

const loginRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.LOGIN.WINDOW_MS,
    limit: RATE_LIMIT.LOGIN.LIMIT,

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,
    skipFailedRequests: false,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many login attempts. Please try again after 1 minute."
        );
    },
});

///////////////////////////////////////////////////////////////
// register rate limiter

const registerRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.REGISTER.WINDOW_MS,
    limit: RATE_LIMIT.REGISTER.LIMIT,

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,
    skipFailedRequests: false,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many account creation attempts. Please try again later."
        );
    },
});

///////////////////////////////////////////////////////////////
// password rate limiter

const passwordRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.FORGOT_PASSWORD.WINDOW_MS, // works same for change password functionality
    limit: RATE_LIMIT.FORGOT_PASSWORD.LIMIT,

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,
    skipFailedRequests: false,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many password reset requests. Please try again later."
        );
    },
});

///////////////////////////////////////////////////////////////
// exports

export { apiRateLimiter, loginRateLimiter, passwordRateLimiter };
