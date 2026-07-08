import {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
} from "../../constants/cookie-options.js";
import HTTP_STATUS from "../../constants/http-status.js";
import logger from "../../utils/pinoLogger.js";
import ApiResponse from "../../utils/responsehandler.js";
import { userRegistration } from "./auth.service.js";

///////////////////////////////////////////////////////////////
// registration controller

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // registraion service
    const { user, accessToken, refreshToken } = await userRegistration({
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
// email verification

const verifyEmail = () => {};

///////////////////////////////////////////////////////////////
// resend verification email

const resendVerificationEmail = () => {};

///////////////////////////////////////////////////////////////
// login

const login = () => {};

///////////////////////////////////////////////////////////////
// logout

const logout = () => {};

///////////////////////////////////////////////////////////////
// refresh access token

const refreshToken = () => {};

///////////////////////////////////////////////////////////////
// forgot password

const forgotPassword = () => {};

///////////////////////////////////////////////////////////////
// reset password

const resetPassword = () => {};

///////////////////////////////////////////////////////////////
// change password

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
