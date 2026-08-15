import dotenv from "dotenv";
import requireEnv from "../utils/env-validator.utility.js";

////////////////////////////////////////////////////////////////////////////////
// Load Environment Variables

if (process.env.NODE_ENV === "development") {
    dotenv.config({
        path: ".env.development",
    });
}

////////////////////////////////////////////////////////////////////////////////
// Server Configuration

const env_appVars = Object.freeze({
    NODE_ENV: process.env.NODE_ENV,
    APP_NAME: requireEnv("APP_NAME"),
    PORT: Number(requireEnv("PORT")),
    CLIENT_URL: requireEnv("CLIENT_URL"),
});

////////////////////////////////////////////////////////////////////////////////
// Database Configuration

const env_dbVars = Object.freeze({
    MONGO_URI: requireEnv("MONGO_URI"),
    DB_NAME: requireEnv("DB_NAME"),
});

////////////////////////////////////////////////////////////////////////////////
// JWT Configuration

const env_jwtVars = Object.freeze({
    JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
    ACCESS_TOKEN_EXPIRY: requireEnv("ACCESS_TOKEN_EXPIRY"),
    ACCESS_TOKEN_COOKIE_EXPIRY: requireEnv("ACCESS_TOKEN_COOKIE_EXPIRY"),

    JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
    REFRESH_TOKEN_EXPIRY: requireEnv("REFRESH_TOKEN_EXPIRY"),
    REFRESH_TOKEN_COOKIE_EXPIRY: requireEnv("REFRESH_TOKEN_COOKIE_EXPIRY"),
});

////////////////////////////////////////////////////////////////////////////////
// Email Configuration

const env_emailVars = Object.freeze({
    EMAIL_LOGO_URL: requireEnv("EMAIL_LOGO_URL"),

    MAILTRAP_API_TOKEN: requireEnv("MAILTRAP_API_TOKEN"),
    MAILTRAP_SANDBOX_ID: requireEnv("MAILTRAP_SANDBOX_ID"),
    MAILTRAP_SENDER_EMAIL: requireEnv("MAILTRAP_SENDER_EMAIL"),
    MAILTRAP_SENDER_NAME: requireEnv("MAILTRAP_SENDER_NAME"),
});

////////////////////////////////////////////////////////////////////////////////
// Cloudinary Configuration

const env_cloudVars = Object.freeze({
    CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
});

////////////////////////////////////////////////////////////////////////////////
// Payment Configuration

const env_paymentVars = Object.freeze({
    CASHFREE_CLIENT_ID: requireEnv("CASHFREE_CLIENT_ID"),
    CASHFREE_CLIENT_SECRET: requireEnv("CASHFREE_CLIENT_SECRET"),
});

////////////////////////////////////////////////////////////////////////////////
// Exports

export {
    env_appVars,
    env_dbVars,
    env_jwtVars,
    env_emailVars,
    env_cloudVars,
    env_paymentVars,
};
