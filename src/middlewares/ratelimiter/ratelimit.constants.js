export const RATE_LIMIT = Object.freeze({
    API: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        LIMIT: 100,
    },

    LOGIN: {
        WINDOW_MS: 1 * 60 * 1000, // 1 minute
        LIMIT: 3,
    },

    REGISTER: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        LIMIT: 5,
    },

    PASSWORD: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        LIMIT: 13,
    },

    UPDATE_PROFILE: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        LIMIT: 3,
    },

    // course related

    CREATE_COURSE: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        LIMIT: 10,
    },

    UPDATE_THUMBNAIL: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        LIMIT: 5,
    },
});

export const RATE_LIMITER_OPTIONS = Object.freeze({
    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,
    skipFailedRequests: false,
});
