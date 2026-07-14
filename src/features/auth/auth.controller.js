import {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
} from "../../constants/cookie-options.js";
import HTTP_STATUS from "../../constants/http-status.js";
import ApiError from "../../utils/errorHandler.js";
import logger from "../../utils/pinoLogger.js";
import ApiResponse from "../../utils/responsehandler.js";
import * as authService from "./auth.service.js";

///////////////////////////////////////////////////////////////
// registration controller

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const { user, accessToken, refreshToken } =
        await authService.userRegistration({
            username,
            email,
            password,
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
// email verification controller

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Email verificaiton token is missing",
        });
    }

    const user = await authService.userEmailVerification({ token });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: "Email has been verified successfully",
            data: user,
        })
    );
};

///////////////////////////////////////////////////////////////
// resend verification email controller

const resendVerificationEmail = () => {};

///////////////////////////////////////////////////////////////
// login controller

const login = async (req, res) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.userLogin({
        email,
        password,
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
    const { user } = req;

    await authService.userLogout(user);

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
    } = await authService.userRotateAuthTokens({
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
// forgot password controller

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    await authService.userForgotPassword({ email });

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
    const { token } = req.params;

    if (!token) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Password reset token is missing",
        });
    }

    const { newPassword } = req.body;

    await authService.userResetPassword({ token, newPassword });

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
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    await authService.userChangePassword({
        userId,
        currentPassword,
        newPassword,
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
    verifyEmail,
    resendVerificationEmail,
    login,
    logout,
    rotateTokens,
    forgotPassword,
    resetPassword,
    changePassword,
};
