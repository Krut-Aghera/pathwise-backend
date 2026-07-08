import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import HTTP_STATUS from "../../constants/http-status.js";
import ApiError from "../../utils/errorHandler.js";
import generateAuthTokens from "../../utils/authTokenGenerator.js";
import * as authRepository from "./auth.repository.js";
import { createUserSession, destroyUserSession } from "./auth.session.js";
import User from "../user/user.model.js";

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

    return await createUserSession(createdUser);
};

///////////////////////////////////////////////////////////////
// login service

const userLogin = async ({ email, password }) => {
    const existingUser = await authRepository
        .findByEmail(email)
        .select("+password");

    if (!existingUser) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid credentials.",
        });
    }

    if (!existingUser.isActive) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: "This account has been deactivated.",
        });
    }

    const isValidPassword = await existingUser.comparePassword(password);

    if (!isValidPassword) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid credentials.",
        });
    }

    return await createUserSession(existingUser);
};

///////////////////////////////////////////////////////////////
// logout service

const userLogout = async (user) => {
    return destroyUserSession(user);
};

///////////////////////////////////////////////////////////////
// exports

export { userRegistration, userLogin, userLogout };
