import rateLimit from "express-rate-limit";
import { RATE_LIMIT, RATE_LIMITER_OPTIONS } from "./ratelimit.constants.js";
import { rateLimitResponse } from "./ratelimit.helper.js";

///////////////////////////////////////////////////////////////
// general API rate limiter

const apiRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.API.WINDOW_MS,
    limit: RATE_LIMIT.API.RATE_LIMIT,

    ...RATE_LIMITER_OPTIONS,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many requests from this IP. Please try again after 15 minutes."
        );
    },
});

///////////////////////////////////////////////////////////////
// register rate limiter

const registerRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.REGISTER.WINDOW_MS,
    limit: RATE_LIMIT.REGISTER.LIMIT,

    ...RATE_LIMITER_OPTIONS,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many account creation attempts. Please try again later."
        );
    },
});

///////////////////////////////////////////////////////////////
// login rate limiter

const loginRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.LOGIN.WINDOW_MS,
    limit: RATE_LIMIT.LOGIN.LIMIT,

    ...RATE_LIMITER_OPTIONS,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many login attempts. Please try again after 1 minute."
        );
    },
});

///////////////////////////////////////////////////////////////
// password rate limiter

const passwordRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.PASSWORD.WINDOW_MS, // works same for change password functionality
    limit: RATE_LIMIT.PASSWORD.LIMIT,

    ...RATE_LIMITER_OPTIONS,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many password reset requests. Please try again later."
        );
    },
});

///////////////////////////////////////////////////////////////
// update profile rate limiter

const updateProfileRateLimiter = rateLimit({
    windowMs: RATE_LIMIT.UPDATE_PROFILE.WINDOW_MS, // works same for change password functionality
    limit: RATE_LIMIT.UPDATE_PROFILE.LIMIT,

    ...RATE_LIMITER_OPTIONS,

    handler: (req, res) => {
        return rateLimitResponse(
            req,
            res,
            "Too many update profile requests. Please try again later."
        );
    },
});

///////////////////////////////////////////////////////////////
// exports

export {
    apiRateLimiter,
    loginRateLimiter,
    passwordRateLimiter,
    updateProfileRateLimiter,
};
