import crypto from "crypto";

const generateSecureTokens = () => {
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    return { token, hashedToken };
};

const getTokenExpiry = (minutes) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};

export { generateSecureTokens, getTokenExpiry };
