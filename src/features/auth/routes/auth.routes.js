import express from "express";

import authPrivateRouter from "./auth.private.routes.js";
import authPublicRouter from "./auth.public.routes.js";

const authRouter = express.Router();

authRouter.use(authPrivateRouter);
authRouter.use(authPublicRouter);

export default authRouter;
