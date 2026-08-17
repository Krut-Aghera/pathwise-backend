import HTTP_STATUS from "../../../constants/http.constants.js";

import ApiError from "../../../utils/error-handler.utility.js";

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
//  export

export default requireActiveAccount;
