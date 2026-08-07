import * as userServices from "./user.service.js";

import ApiResponse from "../../utils/response-handler.utility.js";
import ApiError from "../../utils/error-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { USER_SUCCESS_MESSAGES } from "./user.constants.js";
import {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
    JWT_TOKEN_TYPE,
} from "../../constants/cookie.constants.js";

///////////////////////////////////////////////////////////////
// current user controller

const currentUser = (req, res) => {
    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: USER_SUCCESS_MESSAGES.CURRENT_USER_FETCHED,
            data: req.user,
        })
    );
};

///////////////////////////////////////////////////////////////
// username updation controller

const updateUsername = async (req, res) => {
    const user = await userServices.updateUsername({
        user: req.user,
        username: req.body.username,
    });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: USER_SUCCESS_MESSAGES.USERNAME_UPDATED,
            data: user,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch instructor profile controller

const fetchInstructorProfile = async (req, res) => {
    const instructor = await userServices.fetchInstructorProfile({
        instructorId: req.params.instructorId,
    });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: USER_SUCCESS_MESSAGES.INSTRUCTOR_PROFILE_FETCHED,
            data: instructor,
        })
    );
};

///////////////////////////////////////////////////////////////
// request email updation controller

const requestEmailUpdation = async (req, res) => {
    await userServices.requestEmailUpdation({
        user: req.user,
        password: req.body.password,
        newEmail: req.body.newEmail,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: USER_SUCCESS_MESSAGES.REQUEST_EMAIL_UPDATION,
        })
    );
};

///////////////////////////////////////////////////////////////
// change email confirmation controller

const confirmEmailUpdation = async (req, res) => {
    await userServices.confirmEmailUpdation({
        user: req.user,
        token: req.params.token,
    });

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie(JWT_TOKEN_TYPE.ACCESS, ACCESS_COOKIE_OPTIONS)
        .clearCookie(JWT_TOKEN_TYPE.REFRESH, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: USER_SUCCESS_MESSAGES.CONFIRM_EMAIL_UPDATION,
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
            message: USER_SUCCESS_MESSAGES.REQUEST_INSTRUCTOR_ACCESS,
        })
    );
};

///////////////////////////////////////////////////////////////
// Confirm instructor access controller

const confirmInstructorAccess = async (req, res) => {
    await userServices.confirmInstructorAccess({
        user: req.user,
        token: req.params.token,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: USER_SUCCESS_MESSAGES.CONFIRM_INSTRUCTOR_ACCESS,
        })
    );
};

///////////////////////////////////////////////////////////////
// deactivate account request controller

const requestAccountDeactivation = async (req, res) => {
    await userServices.requestAccountDeactivation({
        user: req.user,
        password: req.body.password,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: USER_SUCCESS_MESSAGES.REQUEST_ACCOUNT_DEACTIVATION,
        })
    );
};

///////////////////////////////////////////////////////////////
// deactivate account confirmation controller

const confirmAccountDeactivation = async (req, res) => {
    await userServices.confirmAccountDeactivation({
        user: req.user,
        otp: req.body.otp,
    });

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie(JWT_TOKEN_TYPE.ACCESS, ACCESS_COOKIE_OPTIONS)
        .clearCookie(JWT_TOKEN_TYPE.REFRESH, REFRESH_COOKIE_OPTIONS)
        .json(
            new ApiResponse({
                statusCode: HTTP_STATUS.OK,
                message: USER_SUCCESS_MESSAGES.CONFIRM_ACCOUNT_DEACTIVATION,
            })
        );
};

///////////////////////////////////////////////////////////////
// exports

export {
    currentUser,
    updateUsername,
    fetchInstructorProfile,
    requestEmailUpdation,
    confirmEmailUpdation,
    requestInstructorAccess,
    confirmInstructorAccess,
    requestAccountDeactivation,
    confirmAccountDeactivation,
};
