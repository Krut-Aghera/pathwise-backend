import createRateLimiter from "../ratelimit.utility.js";
import { RATE_LIMIT } from "../ratelimit.constants.js";

///////////////////////////////////////////////////////////////
// register limiter

export const registerRateLimiter = createRateLimiter({
    window: RATE_LIMIT.AUTH.REGISTER.WINDOW_MS,
    limit: RATE_LIMIT.AUTH.REGISTER.LIMIT,
    resource: "registration",
});

///////////////////////////////////////////////////////////////
// login limiter

export const loginRateLimiter = createRateLimiter({
    window: RATE_LIMIT.AUTH.LOGIN.WINDOW_MS,
    limit: RATE_LIMIT.AUTH.LOGIN.LIMIT,
    resource: "login",
});

///////////////////////////////////////////////////////////////
// email verification request limiter

export const requestEmailVerificationRateLimiter = createRateLimiter({
    window: RATE_LIMIT.AUTH.REGISTER.WINDOW_MS,
    limit: RATE_LIMIT.AUTH.REGISTER.LIMIT,
    resource: "email verification request",
});

///////////////////////////////////////////////////////////////
// forgot password limiter

export const forgotPasswordRateLimiter = createRateLimiter({
    window: RATE_LIMIT.AUTH.PASSWORD.WINDOW_MS,
    limit: RATE_LIMIT.AUTH.PASSWORD.LIMIT,
    resource: "forgot password",
});

///////////////////////////////////////////////////////////////
// reset password limiter

export const resetPasswordRateLimiter = createRateLimiter({
    window: RATE_LIMIT.AUTH.PASSWORD.WINDOW_MS,
    limit: RATE_LIMIT.AUTH.PASSWORD.LIMIT,
    resource: "password reset",
});

///////////////////////////////////////////////////////////////
// change password limiter

export const changePasswordRateLimiter = createRateLimiter({
    window: RATE_LIMIT.AUTH.PASSWORD.WINDOW_MS,
    limit: RATE_LIMIT.AUTH.PASSWORD.LIMIT,
    resource: "password change",
});
