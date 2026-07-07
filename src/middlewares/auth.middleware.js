import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler";
import User from "../features/user/user.model.js";
import { jwtConfig } from "../config/env.config";
import HTTP_STATUS from "../constants/http-status.js";

///////////////////////////////////////////////////////////////
// token verification middleware

const tokenVerificationEngine = catchAsync(async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token not found");
    }

    const decoded = jwt.verify(accessToken, jwtConfig.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });

    const user = await User.findById(decoded.userId);

    if (!user) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "User associated with this token no longer exists."
        );
    }

    if (!user.isActive) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, "This account has been deactivated");
    }

    req.user = user;
    next();
});

///////////////////////////////////////////////////////////////
// authorization middleware

const authorizeRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Please log in to continue.");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                HTTP_STATUS.FORBIDDEN,
                "Access denied. You do not have permission to perform this action."
            );
        }

        next();
    };
};

export default authorizeRole;
