import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/env.config.js";

const generateAuthTokens = (userId, userEmail) => {
    const accessToken = jwt.sign(
        {
            userId,
            userEmail
        },
        jwtConfig.JWT_ACCESS_SECRET,
        {
            expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRY,
        }
    );

    const refreshToken = jwt.sign(
        {
            userId,
            userEmail
        },
        jwtConfig.JWT_REFRESH_SECRET,
        {
            expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRY,
        }
    );

    return {
        accessToken,
        refreshToken,
    };
};

export default generateAuthTokens;
