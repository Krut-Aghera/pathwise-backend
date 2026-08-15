import jwt from "jsonwebtoken";

import { env_jwtVars } from "../../../config/env.config.js";

import HTTP_STATUS from "../../../constants/http.constants.js";

import User from "../../../features/user/user.model.js";

import ApiError from "../../../utils/error-handler.utility.js";

///////////////////////////////////////////////////////////////
// refresh token verification middleware

const refreshTokenVerification = async (req, _res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Refresh token not found.",
        });
    }

    const decoded = jwt.verify(
        refreshToken,
        env_jwtVars.JWT_REFRESH_SECRET,
        {
            algorithms: ["HS256"],
        }
    );

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
// export 

export default refreshTokenVerification