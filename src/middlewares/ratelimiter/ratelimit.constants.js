import { env_appVars } from "../../config/env.config.js";

const RATE_LIMITER_OPTIONS = Object.freeze({
    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,
    skipFailedRequests: false,
});

const WINDOWS = Object.freeze({
    ONE_MINUTE: 1 * 60 * 1000,
    FIFTEEN_MINUTES: 15 * 60 * 1000,
    THIRTY_MINUTES: 30 * 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
});

const RATE_LIMIT = Object.freeze({
    API: Object.freeze({
        GLOBAL: {
            WINDOW_MS: WINDOWS.FIFTEEN_MINUTES,
            LIMIT: 100,
        },
    }),

    AUTH: Object.freeze({
        LOGIN: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: env_appVars.NODE_ENV === "test" ? 100 : 5,
        },

        REGISTER: {
            WINDOW_MS: WINDOWS.ONE_HOUR,
            LIMIT: env_appVars.NODE_ENV === "test" ? 100 : 5,
        },

        PASSWORD: {
            WINDOW_MS: WINDOWS.ONE_HOUR,
            LIMIT: env_appVars.NODE_ENV === "test" ? 100 : 10,
        },
    }),

    USER: Object.freeze({
        UPDATE_PROFILE: {
            WINDOW_MS: WINDOWS.ONE_HOUR,
            LIMIT: 5,
        },

        EMAIL_CHANGE: {
            WINDOW_MS: WINDOWS.ONE_HOUR,
            LIMIT: 5,
        },

        ACCOUNT_DEACTIVATION: {
            WINDOW_MS: WINDOWS.ONE_HOUR,
            LIMIT: 3,
        },

        REQUEST_INSTRUCTOR_ACCESS: {
            WINDOW_MS: WINDOWS.ONE_HOUR,
            LIMIT: 3,
        },
    }),

    COURSE: Object.freeze({
        CREATE: {
            WINDOW_MS: WINDOWS.ONE_HOUR,
            LIMIT: 10,
        },

        UPDATE: {
            WINDOW_MS: WINDOWS.THIRTY_MINUTES,
            LIMIT: 30,
        },

        DELETE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 5,
        },

        UPDATE_THUMBNAIL: {
            WINDOW_MS: WINDOWS.THIRTY_MINUTES,
            LIMIT: 5,
        },

        CHANGE_STATUS: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 10,
        },

        FETCH_ONE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 100,
        },

        FETCH_LIST: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 90,
        },
    }),

    SECTION: Object.freeze({
        CREATE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 30,
        },

        UPDATE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 30,
        },

        DELETE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 20,
        },

        REORDER: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 20,
        },

        CHANGE_STATUS: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 10,
        },
    }),

    LECTURE: Object.freeze({
        CREATE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 30,
        },

        UPDATE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 30,
        },

        DELETE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 20,
        },

        REORDER: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 20,
        },

        CHANGE_STATUS: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 10,
        },

        UPLOAD_VIDEO: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 10,
        },

        REMOVE_VIDEO: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 10,
        },

        FETCH_ONE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 120,
        },

        FETCH_LIST: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 120,
        },

        FETCH_STUDENT_LECTURE: {
            WINDOW_MS: 60 * 1000, // 1 minute
            LIMIT: 100,
        },
    }),

    REVIEW: Object.freeze({
        CREATE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 10,
        },

        UPDATE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 10,
        },

        DELETE: {
            WINDOW_MS: WINDOWS.ONE_MINUTE,
            LIMIT: 5,
        },
    }),
});

const ORDER_RT = Object.freeze({
    CREATE: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 5,
    },

    CANCEL: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 10,
    },
});

const PAYMENT_RT = Object.freeze({
    CREATE: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 5,
    },

    VERIFY: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 10,
    },

    FETCH_CURRENT: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 20,
    },

    WEBHOOK: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 100,
    },
});

const ENROLLMENT_RT = Object.freeze({
    FETCH_ONE: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 60,
    },

    FETCH_LIST: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 60,
    },
});

const WISHLIST_RT = Object.freeze({
    ADD: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 20,
    },

    REMOVE: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 20,
    },

    FETCH: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 60,
    },

    CLEAR: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 10,
    },
});

const PROGRESS_RT = Object.freeze({
    FETCH: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 30,
    },

    INITIALIZE: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 30,
    },

    UPDATE: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 30,
    },

    COMPLETE: {
        WINDOW_MS: WINDOWS.ONE_MINUTE,
        LIMIT: 10,
    },
});

export {
    RATE_LIMITER_OPTIONS,
    RATE_LIMIT,
    ORDER_RT,
    PAYMENT_RT,
    ENROLLMENT_RT,
    WISHLIST_RT,
    PROGRESS_RT,
};
