import * as userServices from "./user.service.js";
import ApiResponse from "../../utils/responsehandler.js";
import ApiError from "../../utils/errorHandler.js";
import HTTP_STATUS from "../../constants/http-status.js";
import {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
} from "../../constants/cookie-options.js";
import { USER_PROFILE_LIST } from "./user.constants.js";

///////////////////////////////////////////////////////////////
// get current user controller

const getCurrentUser = (req, res) => {
    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: "Current user fetched successfully.",
            data: req.user,
        })
    );
};

///////////////////////////////////////////////////////////////
// username updation controller

const usernameUpdation = async (req, res) => {
    const user = await userServices.updateUsername({
        user: req.user,
        username: req.body.username,
    });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: "Username has been updated successfully.",
            data: user,
        })
    );
};

///////////////////////////////////////////////////////////////
// request email updation controller

const requestEmailUpdation = async (req, res) => {
    const { password, newEmail } = req.body;

    await userServices.requestEmailUpdation({
        user: req.user,
        password,
        newEmail,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message:
                "We've sent a verification link to your new email address.",
        })
    );
};

///////////////////////////////////////////////////////////////
// change email confirmation controller

const confirmEmailUpdation = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Email change token is missing.",
        });
    }

    await userServices.confirmEmailUpdation({
        user: req.user,
        token,
    });

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie("accessToken", ACCESS_COOKIE_OPTIONS)
        .clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message:
                    "Your email address has been updated successfully. Please sign in again using your new email address.",
            })
        );
};

///////////////////////////////////////////////////////////////
// Request instructor access controller

const requestInstructorAccess = async (req, res) => {
    await userServices.requestInstructorAccess({
        user: req.user,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message:
                "We've sent a verification link to your email address. Verify it to become an instructor.",
        })
    );
};

///////////////////////////////////////////////////////////////
// Confirm instructor access controller

const confirmInstructorAccess = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Instructor verification token is missing.",
        });
    }

    await userServices.confirmInstructorAccess({
        user: req.user,
        token,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message:
                "Congratulations! Your instructor account has been activated successfully.",
        })
    );
};

///////////////////////////////////////////////////////////////
// get instructor profile controller

const getInstructorProfile = async (req, res) => {};

///////////////////////////////////////////////////////////////
// deactivate account request controller

const requestAccountDeactivation = async (req, res) => {
    const { password } = req.body;

    await userServices.requestAccountDeactivation({
        user: req.user,
        password,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message:
                "A verification code for account deactivation has been sent to your registered email address.",
        })
    );
};

///////////////////////////////////////////////////////////////
// deactivate account confirmation controller

const confirmAccountDeactivation = async (req, res) => {
    const { otp } = req.body;

    await userServices.confirmAccountDeactivation({
        user: req.user,
        otp,
    });

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie("accessToken", ACCESS_COOKIE_OPTIONS)
        .clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: "Your account has been deactivated successfully.",
            })
        );
};

///////////////////////////////////////////////////////////////
// exports
export {
    getCurrentUser,
    usernameUpdation,
    requestEmailUpdation,
    confirmEmailUpdation,
    requestInstructorAccess,
    confirmInstructorAccess,
    getInstructorProfile,
    requestAccountDeactivation,
    confirmAccountDeactivation,
};
