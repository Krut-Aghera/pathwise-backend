import { Router } from "express";

import authRouter from "../features/auth/auth.routes.js";

const router = Router();

///////////////////////////////////////////////////////////////
// routes configuration

router.use("/auth", authRouter);

///////////////////////////////////////////////////////////////
// export

export default router;
