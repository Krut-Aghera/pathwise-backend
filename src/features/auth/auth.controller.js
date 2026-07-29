import {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
} from "../../constants/cookie.constants.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import logger from "../../utils/pino-logger.utility.js";
import ApiResponse from "../../utils/response-handler.utility.js";
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
        .cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.CREATED,
                message: "User registration successful",
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
            message: "We've sent a verification link to your email address.",
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
            message: "Email has been verified successfully",
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
        .cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: "User login successful",
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
        .clearCookie("accessToken", ACCESS_COOKIE_OPTIONS)
        .clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: "User logout successful",
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
        .cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS)
        .cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: "Tokens rotated successfully.",
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
            message:
                "If an account with that email exists, we've sent a password reset link.",
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
        .clearCookie("accessToken", ACCESS_COOKIE_OPTIONS)
        .clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: "Password has been reset successfully.",
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
        .clearCookie("accessToken", ACCESS_COOKIE_OPTIONS)
        .clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: "Password has been changed successfully.",
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
