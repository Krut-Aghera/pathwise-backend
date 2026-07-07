import dotenv from "dotenv";

////////////////////////////////////////////////////////////////////////////////
// Load .env only in development

if (process.env.NODE_ENV == "development") {
    dotenv.config({
        path: ".env.development",
    });
}

////////////////////////////////////////////////////////////////////////////////
// check if any reuired env is missing

const requireEnv = (key) => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

////////////////////////////////////////////////////////////////////////////////
// Server Configuration

export const serverAppConfig = Object.freeze({
    APP_NAME: requireEnv("APP_NAME"),
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(requireEnv("PORT")),
    CLIENT_URL: requireEnv("CLIENT_URL"),
});

export const dbConfig = Object.freeze({
    MONGO_URI: requireEnv("MONGO_URI"),
    DB_NAME: requireEnv("DB_NAME"),
});

export const jwtConfig = Object.freeze({
    JWT_ACCESS_SECRET: Number(requireEnv("JWT_ACCESS_SECRET")),
    JWT_REFRESH_SECRET: Number(requireEnv("JWT_REFRESH_SECRET")),
    ACCESS_TOKEN_EXPIRY: requireEnv("ACCESS_TOKEN_EXPIRY"),
    REFRESH_TOKEN_EXPIRY: requireEnv("REFRESH_TOKEN_EXPIRY"),
    ACCESS_TOKEN_COOKIE_EXPIRY: requireEnv("ACCESS_TOKEN_COOKIE_EXPIRY"),
    REFRESH_TOKEN_COOKIE_EXPIRY: requireEnv("REFRESH_TOKEN_COOKIE_EXPIRY"),
});
