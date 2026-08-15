import express from "express";

import userPrivateRouter from "./user.private.routes.js";
import userPublicRouter from "./user.public.routes.js";

const userRouter = express.Router();

userRouter.use(userPrivateRouter);
userRouter.use(userPublicRouter);

export default userRouter;
