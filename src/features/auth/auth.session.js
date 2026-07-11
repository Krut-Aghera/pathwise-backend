import { jwtConfig } from "../../config/env.config.js";
import generateAuthTokens from "../../utils/authTokenGenerator.js";
import * as authRepository from "./auth.repository.js";
import crypto from "crypto";

///////////////////////////////////////////////////////////////
// create session

const createUserSession = async (user) => {
    const { accessToken, refreshToken } = generateAuthTokens(user);

    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    user.refreshToken = hashedRefreshToken;
    const savedUser = await authRepository.saveUser(user);

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
    await authRepository.saveUser(user);
};

///////////////////////////////////////////////////////////////
// exports

export { createUserSession, destroyUserSession };
