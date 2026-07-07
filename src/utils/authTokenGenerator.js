import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/env.config.js";

const generateAuthTokens = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        jwtConfig.JWT_ACCESS_SECRET,
        {
            expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRY,
        }
    );

    const refreshToken = jwt.sign(
        {
            userId: user._id,
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
