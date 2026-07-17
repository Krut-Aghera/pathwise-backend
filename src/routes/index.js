import { Router } from "express";

import authRouter from "../features/auth/auth.routes.js";
import userRouter from "../features/user/user.routes.js";

const router = Router();

///////////////////////////////////////////////////////////////
// routes configuration

router.use("/auth", authRouter);
router.use("/user", userRouter);

///////////////////////////////////////////////////////////////
// export

export default router;
