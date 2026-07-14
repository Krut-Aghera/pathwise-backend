import { serverAppConfig } from "../../config/env.config.js";

// Create email verification URL
const createEmailVerificationUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/verify-email/${token}`;
};

///////////////////////////////////////////////////////////////
// Create email change verification URL
const createEmailChangeVerificationUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/change-email/${token}`;
};

// Create password reset URL
const createPasswordResetUrl = (token) => {
    return `${serverAppConfig.CLIENT_URL}/reset-password/${token}`;
};

export {
    createEmailVerificationUrl,
    createEmailChangeVerificationUrl,
    createPasswordResetUrl,
};
