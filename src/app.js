import express from "express";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import authRouter from "./features/auth/auth.routes.js";
import userRouter from "./features/user/user.routes.js";
import courseRouter from "./features/course/course.routes.js";
import ApiResponse from "./utils/responsehandler.js";
import HTTP_STATUS from "./constants/http-status.js";
import { serverAppConfig } from "./config/env.config.js";
import morganLogger from "./config/morgan.config.js";
import helmetMiddleware from "./middlewares/helmet.middleware.js";
import { apiRateLimiter } from "./middlewares/ratelimiter/ratelimit.middleware.js";
import {
    globalErrorMiddleware,
    notFoundErrorMiddleware,
} from "./middlewares/error.middleware.js";

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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

///////////////////////////////////////////////////////////////
// error middlewares

app.use(notFoundErrorMiddleware);
app.use(globalErrorMiddleware);

///////////////////////////////////////////////////////////////
// export

export default app;
