import express from "express";

import enrollmentInstructorRouter from "./enrollment.instructor.routes.js";
import enrollmentStudentRouter from "./enrollment.student.routes.js";
import enrollmentAdminRouter from "./enrollment.admin.routes.js";

///////////////////////////////////////////////////////////////
// create router

const enrollmentRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount student routes

enrollmentRouter.use(enrollmentStudentRouter);

///////////////////////////////////////////////////////////////
// mount instructor routes

enrollmentRouter.use("/instructors", enrollmentInstructorRouter);

///////////////////////////////////////////////////////////////
// mount admin routes

enrollmentRouter.use("/admins", enrollmentAdminRouter);

///////////////////////////////////////////////////////////////
// export

export default enrollmentRouter;
