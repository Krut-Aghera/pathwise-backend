import { serverAppConfig } from "../../config/env.config.js";

// Generate token expiry
export const getEmailTokenExpiry = (minutes = 15) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};

// Create email verification URL
export const createEmailVerificationUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/verify-email/${token}`;
};

// Create password reset URL
export const createPasswordResetUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/reset-password/${token}`;
};
