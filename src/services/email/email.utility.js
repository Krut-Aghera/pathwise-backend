import { env_appVars } from "../../config/env.config.js";

// Create email verification URL
export const getEmailVerificationUrl = (token) => {
    return `${env_appVars.CLIENT_URL}/auth/verify-email/${token}`;
};

// Create email change verification URL
export const createEmailChangeVerificationUrl = (token) => {
    return `${env_appVars.CLIENT_URL}/auth/change-email/${token}`;
};

// Create password reset URL
export const createPasswordResetUrl = (token) => {
    return `${env_appVars.CLIENT_URL}/auth/reset-password/${token}`;
};

// Create instructor access verification URL
export const createInstructorAccessVerificationUrl = (token) => {
    return `${env_appVars.CLIENT_URL}/user/instructor-access/${token}`;
};
