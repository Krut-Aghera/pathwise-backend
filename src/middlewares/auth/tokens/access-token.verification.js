import jwt from "jsonwebtoken";

import { env_jwtVars } from "../../../config/env.config.js";

import HTTP_STATUS from "../../../constants/http.constants.js";

import User from "../../../features/user/user.model.js";

import ApiError from "../../../utils/error-handler.utility.js";

///////////////////////////////////////////////////////////////
// access token verification middleware

const accessTokenVerification = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        throw new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Access token not found",
        });
    }

    const decoded = jwt.verify(accessToken, env_jwtVars.JWT_ACCESS_SECRET, {
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
// export

export default accessTokenVerification;
