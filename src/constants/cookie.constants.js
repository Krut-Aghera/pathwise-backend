const isProduction = process.env.NODE_ENV === "production";

export const JWT_TOKEN_TYPE = Object.freeze({
    ACCESS: "accessToken",
    REFRESH: "refreshToken",
});

export const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
};

export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
