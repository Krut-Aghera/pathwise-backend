import crypto from "crypto";
import jwt from "jsonwebtoken";

import * as userRepository from "../user/user.repository.js";

import { jwtEnvConfig } from "../../config/env.config.js";

///////////////////////////////////////////////////////////////
// generate auth tokens

const generateAuthTokens = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            userEmail: user.email,
        },
        jwtEnvConfig.JWT_ACCESS_SECRET,
        {
            expiresIn: jwtEnvConfig.ACCESS_TOKEN_EXPIRY,
        }
    );

    const refreshToken = jwt.sign(
        {
            userId: user._id,
            userEmail: user.email,
        },
        jwtEnvConfig.JWT_REFRESH_SECRET,
        {
            expiresIn: jwtEnvConfig.REFRESH_TOKEN_EXPIRY,
        }
    );

    return {
        accessToken,
        refreshToken,
    };
};

///////////////////////////////////////////////////////////////
// create session

const createSession = async (user) => {
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

const destroySession = async (user) => {
    user.refreshToken = null;
    await userRepository.saveUser(user);
};

///////////////////////////////////////////////////////////////
// exports

export { createSession, destroySession };
