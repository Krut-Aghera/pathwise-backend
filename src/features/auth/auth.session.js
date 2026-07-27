import { jwtConfig } from "../../config/env.config.js";
import * as userRepository from "../user/user.repository.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

///////////////////////////////////////////////////////////////
// generate auth tokens

const generateAuthTokens = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            userEmail: user.email,
        },
        jwtConfig.JWT_ACCESS_SECRET,
        {
            expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRY,
        }
    );

    const refreshToken = jwt.sign(
        {
            userId: user._id,
            userEmail: user.emil,
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

///////////////////////////////////////////////////////////////
// create session

const createUserSession = async (user) => {
    const { accessToken, refreshToken } = generateAuthTokens(user);

    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    user.refreshToken = hashedRefreshToken;
    const savedUser = await userRepository.saveUser(user);

    return {
        user: savedUser,
        accessToken,
        refreshToken,
    };
};

///////////////////////////////////////////////////////////////
// destroy session

const destroyUserSession = async (user) => {
    user.refreshToken = null;
    await userRepository.saveUser(user);
};

///////////////////////////////////////////////////////////////
// exports

export { createUserSession, destroyUserSession };
