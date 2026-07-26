import { serverAppConfig } from "../../config/env.config.js";

// Create email verification URL
export const createEmailVerificationUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/verify-email/${token}`;
};

// Create email change verification URL
export const createEmailChangeVerificationUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/change-email/${token}`;
};

// Create password reset URL
export const createPasswordResetUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/reset-password/${token}`;
};

// Create instructor access verification URL
export const createInstructorAccessVerificationUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/instructor-access/${token}`;
};
