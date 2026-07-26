import createRateLimiter from "../ratelimit.utility.js";
import { RATE_LIMIT } from "../ratelimit.constants.js";

///////////////////////////////////////////////////////////////
// update profile limiter

export const updateProfileRateLimiter = createRateLimiter({
    window: RATE_LIMIT.USER.UPDATE_PROFILE.WINDOW_MS,
    limit: RATE_LIMIT.USER.UPDATE_PROFILE.LIMIT,
    resource: "profile update",
});

///////////////////////////////////////////////////////////////
// email change request limiter

export const requestEmailChangeRateLimiter = createRateLimiter({
    window: RATE_LIMIT.USER.EMAIL_CHANGE.WINDOW_MS,
    limit: RATE_LIMIT.USER.EMAIL_CHANGE.LIMIT,
    resource: "email update request",
});

///////////////////////////////////////////////////////////////
// account deletion request limiter

export const requestAccountDeletionRateLimiter = createRateLimiter({
    window: RATE_LIMIT.USER.ACCOUNT_DEACTIVATION.WINDOW_MS,
    limit: RATE_LIMIT.USER.ACCOUNT_DEACTIVATION.LIMIT,
    resource: "account deletion request",
});

///////////////////////////////////////////////////////////////
// instructor access limiter

export const requestInstructorAccessRateLimiter = createRateLimiter({
    window: RATE_LIMIT.USER.REQUEST_INSTRUCTOR_ACCESS.WINDOW_MS,
    limit: RATE_LIMIT.USER.REQUEST_INSTRUCTOR_ACCESS.LIMIT,
    resource: "instructor access request",
});
