import express from "express";

import progressAuthenticatedUser from "./progress.authenticatedUser.routes.js";

const progressRouter = express.Router();

progressRouter.use("/students", progressAuthenticatedUser);

export default progressRouter;
