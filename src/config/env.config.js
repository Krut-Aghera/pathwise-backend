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
