import HTTP_STATUS from "../../../constants/http.constants.js";

import ApiError from "../../../utils/error-handler.utility.js";

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

///////////////////////////////////////////////////////////////
//  export

export default requireVerifiedEmail