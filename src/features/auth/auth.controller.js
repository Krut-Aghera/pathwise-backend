import {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
} from "../../constants/cookie-options.js";
import HTTP_STATUS from "../../constants/http-status.js";
import logger from "../../utils/pinoLogger.js";
import ApiResponse from "../../utils/responsehandler.js";
import * as authService from "./auth.service.js";

///////////////////////////////////////////////////////////////
// registration controller

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // registraion service
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

const verifyEmail = () => {};

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
// refresh access token controller

const refreshToken = () => {};

///////////////////////////////////////////////////////////////
// forgot password controller

const forgotPassword = () => {};

///////////////////////////////////////////////////////////////
// reset password controller

const resetPassword = () => {};

///////////////////////////////////////////////////////////////
// change password controller

const changePassword = () => {};

///////////////////////////////////////////////////////////////
// exports

export {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
};
