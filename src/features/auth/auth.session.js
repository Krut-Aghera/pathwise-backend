import generateAuthTokens from "../../utils/authTokenGenerator.js";
import * as authRepository from "./auth.repository.js";

///////////////////////////////////////////////////////////////
// create session

const createUserSession = async (user) => {
    const { accessToken, refreshToken } = generateAuthTokens(user);

    user.refreshToken = refreshToken;
    const savedUser = await authRepository.saveUser(user);

    return {
        user: savedUser,
        accessToken,
        refreshToken,
    };
};

///////////////////////////////////////////////////////////////
// exports

export { createUserSession };
