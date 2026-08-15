import ApiError from "../../utils/error-handler.utility.js";
import ApiResponse from "../../utils/response-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
    JWT_TOKEN_TYPE,
} from "../../constants/cookie.constants.js";

import { AUTH_SUCCESS_MESSAGES } from "./auth.constants.js";
import * as authService from "./auth.service.js";

///////////////////////////////////////////////////////////////
// registration controller

const registerUser = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.registerUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    return res
        .status(HTTP_STATUS.CREATED)
        .cookie(JWT_TOKEN_TYPE.ACCESS, accessToken, ACCESS_COOKIE_OPTIONS)
        .cookie(JWT_TOKEN_TYPE.REFRESH, refreshToken, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.CREATED,
                message: AUTH_SUCCESS_MESSAGES.REGISTER,
                data: user,
            })
        );
};

///////////////////////////////////////////////////////////////
// request email verification controller

const requestEmailVerification = async (req, res) => {
    await authService.requestEmailVerification({ user: req.user });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: AUTH_SUCCESS_MESSAGES.EMAIL_VERIFICATION_REQUESTED,
        })
    );
};

///////////////////////////////////////////////////////////////
// confirm email verification controller

const confirmEmailVerification = async (req, res) => {
    const user = await authService.confirmEmailVerification({
        token: req.params.token,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: AUTH_SUCCESS_MESSAGES.EMAIL_VERIFIED,
            data: user,
        })
    );
};

///////////////////////////////////////////////////////////////
// login controller

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login({
        email: req.body.email,
        password: req.body.password,
    });

    return res
        .status(HTTP_STATUS.OK)
        .cookie(JWT_TOKEN_TYPE.ACCESS, accessToken, ACCESS_COOKIE_OPTIONS)
        .cookie(JWT_TOKEN_TYPE.REFRESH, refreshToken, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: AUTH_SUCCESS_MESSAGES.LOGIN,
                data: user,
            })
        );
};

///////////////////////////////////////////////////////////////
// logout controller

const logout = async (req, res) => {
    await authService.logout({ user: req.user });

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie(JWT_TOKEN_TYPE.ACCESS, ACCESS_COOKIE_OPTIONS)
        .clearCookie(JWT_TOKEN_TYPE.REFRESH, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: AUTH_SUCCESS_MESSAGES.LOGOUT,
            })
        );
};

///////////////////////////////////////////////////////////////
// rotate auth tokens controller

const rotateTokens = async (req, res) => {
    const { refreshToken: currentRefreshToken } = req.cookies;

    if (!currentRefreshToken) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Refresh token not found.",
        });
    }

    const {
        user,
        accessToken,
        refreshToken: newRefreshToken,
    } = await authService.rotateTokens({
        refreshToken: currentRefreshToken,
    });

    return res
        .status(HTTP_STATUS.OK)
        .cookie(JWT_TOKEN_TYPE.ACCESS, accessToken, ACCESS_COOKIE_OPTIONS)
        .cookie(JWT_TOKEN_TYPE.REFRESH, newRefreshToken, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: AUTH_SUCCESS_MESSAGES.TOKENS_REFRESHED,
                data: user,
            })
        );
};

///////////////////////////////////////////////////////////////
// request password reset controller

const requestPasswordReset = async (req, res) => {
    await authService.requestPasswordReset({ email: req.body.email });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_REQUESTED,
        })
    );
};

///////////////////////////////////////////////////////////////
// reset password controller

const resetPassword = async (req, res) => {
    await authService.resetPassword({
        token: req.params.token,
        newPassword: req.body.newPassword,
    });

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie(JWT_TOKEN_TYPE.ACCESS, ACCESS_COOKIE_OPTIONS)
        .clearCookie(JWT_TOKEN_TYPE.REFRESH, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: AUTH_SUCCESS_MESSAGES.PASSWORD_RESET,
            })
        );
};

///////////////////////////////////////////////////////////////
// change password controller

const changePassword = async (req, res) => {
    await authService.changePassword({
        userId: req.user._id,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
    });

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie(JWT_TOKEN_TYPE.ACCESS, ACCESS_COOKIE_OPTIONS)
        .clearCookie(JWT_TOKEN_TYPE.REFRESH, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: AUTH_SUCCESS_MESSAGES.PASSWORD_CHANGED,
            })
        );
};

///////////////////////////////////////////////////////////////
// exports

export {
    registerUser,
    requestEmailVerification,
    confirmEmailVerification,
    login,
    logout,
    rotateTokens,
    requestPasswordReset,
    resetPassword,
    changePassword,
};
