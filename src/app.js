import express from "express";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import morganLogger from "./config/morgan.config.js";
import { serverAppConfig } from "./config/env.config.js";
import { apiRateLimiter } from "./middlewares/ratelimit.middleware.js";
import { globalErrorMiddleware, notFoundErrorMiddleware } from "./middlewares/error.middleware.js";
import HTTP_STATUS from "./constants/http-status.js";
import ApiResponse from "./utils/responsehandler.js";
import helmetMiddleware from "./middlewares/helmet.middleware.js";

const app = express();

///////////////////////////////////////////////////////////////
// security middleware

app.use(apiRateLimiter);
app.use(helmetMiddleware);
app.use(hpp());
app.use(
    cors({
        origin: serverAppConfig?.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "HEAD", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

///////////////////////////////////////////////////////////////
// morgan middleware for logs

if (serverAppConfig?.NODE_ENV === "development") {
    app.use(morganLogger);
}

///////////////////////////////////////////////////////////////
// express middlewares

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(cookieParser());

///////////////////////////////////////////////////////////////
// route middleware

// testing route

app.get("/", (req, res) => {
    res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: "home route is working fine",
        })
    );
});

app.get("/test", (req, res) => {
    res.status(HTTP_STATUS.ACCEPTED).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.ACCEPTED,
            message: "test route is working fine",
        })
    );
});

///////////////////////////////////////////////////////////////
// error middlewares

app.use(notFoundErrorMiddleware);
app.use(globalErrorMiddleware);

export default app;
