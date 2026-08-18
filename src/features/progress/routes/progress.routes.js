import express from "express";

import progressStudentRouter from "./progress.student.routes.js";

const progressRouter = express.Router();

progressRouter.use("/students", progressStudentRouter);

export default progressRouter;
