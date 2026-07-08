import HTTP_STATUS from "../../constants/http-status.js";
import ApiError from "../../utils/errorHandler.js";
import generateAuthTokens from "../../utils/authTokenGenerator.js";
import * as authRepository from "./auth.repository.js";
import { createUserSession } from "./auth.session.js";

///////////////////////////////////////////////////////////////
// registration service

const userRegistration = async ({ username, email, password }) => {
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: "User already exists with provided email.",
        });
    }

    const createdUser = await authRepository.createUser({
        username,
        email,
        password,
    });

    const { user, accessToken, refreshToken } =
        await createUserSession(createdUser);

    return {
        user,
        accessToken,
        refreshToken,
    };
};

///////////////////////////////////////////////////////////////
// exports

export { userRegistration };
