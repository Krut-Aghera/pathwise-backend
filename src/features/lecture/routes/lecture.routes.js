import express from "express";

import lecturePrivateRouter from "./lecture.private.routes.js";
import lectureStudentRouter from "./lecture.student.routes.js";

///////////////////////////////////////////////////////////////
// create router

const lectureRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount private routes

lectureRouter.use("/students", lectureStudentRouter);
lectureRouter.use(lecturePrivateRouter);

///////////////////////////////////////////////////////////////
// export

export default lectureRouter;
