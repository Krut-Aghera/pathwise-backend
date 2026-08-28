import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";

///////////////////////////////////////////////////////////////
// role authorization middleware

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
// exports

export default authorizeRole;
