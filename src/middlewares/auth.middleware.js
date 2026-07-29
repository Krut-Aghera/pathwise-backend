import jwt from "jsonwebtoken";
import ApiError from "../utils/error-handler.utility.js";
import User from "../features/user/user.model.js";
import { jwtConfig } from "../config/env.config.js";
import HTTP_STATUS from "../constants/http.constants.js";

///////////////////////////////////////////////////////////////
// token verification middleware

const tokenVerificationEngine = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Access token not found",
        });
    }

    const decoded = jwt.verify(accessToken, jwtConfig.JWT_ACCESS_SECRET, {
        algorithms: ["HS256"],
    });

    const user = await User.findById(decoded.userId);

    if (!user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "User associated with this token no longer exists.",
        });
    }

    req.user = user;
    next();
};

///////////////////////////////////////////////////////////////
// authorization middleware

const authorizeRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new ApiError({
                statusCode: HTTP_STATUS.UNAUTHORIZED,
                message: "Please log in to continue.",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.FORBIDDEN,
                message:
                    "Access denied. You do not have permission to perform this action.",
            });
        }

        next();
    };
};

///////////////////////////////////////////////////////////////
//  require active account middleware

const requireActiveAccount = (req, res, next) => {
    if (!req.user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Authentication required.",
        });
    }

    if (!req.user.isActive) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message:
                "Your account has been deactivated. Please contact support if you believe this is an error.",
        });
    }

    next();
};

///////////////////////////////////////////////////////////////
//  require verified email middleware

const requireVerifiedEmail = (req, res, next) => {
    if (!req.user) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Authentication required.",
        });
    }

    if (!req.user.isEmailVerified) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message:
                "Please verify your email address to access this resource.",
        });
    }

    next();
};

export {
    tokenVerificationEngine,
    authorizeRole,
    requireActiveAccount,
    requireVerifiedEmail,
};
