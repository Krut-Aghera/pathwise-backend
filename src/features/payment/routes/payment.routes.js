import express from "express";

import paymentStudentRouter from "./payment.student.routes.js";
import paymentWebhookRouter from "./payment.webhook.routes.js";

///////////////////////////////////////////////////////////////
// create router

const paymentRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount payment webhook routes

paymentRouter.use("/webhooks", paymentWebhookRouter);

///////////////////////////////////////////////////////////////
// mount student payment private routes

paymentRouter.use(paymentStudentRouter);

///////////////////////////////////////////////////////////////
// export

export default paymentRouter;