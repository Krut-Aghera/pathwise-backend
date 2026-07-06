const RATE_LIMIT = Object.freeze({
    API: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        LIMIT: 100,
    },

    LOGIN: {
        WINDOW_MS: 1 * 60 * 1000, // 1 minute
        LIMIT: 5,
    },

    REGISTER: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        LIMIT: 5,
    },

    FORGOT_PASSWORD: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        LIMIT: 3,
    },

    RESET_PASSWORD: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        LIMIT: 5,
    },
});

export default RATE_LIMIT;
