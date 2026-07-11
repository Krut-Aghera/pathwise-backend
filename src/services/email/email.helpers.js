import { serverAppConfig } from "../../config/env.config.js";

// Create email verification URL
export const createEmailVerificationUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/verify-email/${token}`;
};

// Create password reset URL
export const createPasswordResetUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/reset-password/${token}`;
};
