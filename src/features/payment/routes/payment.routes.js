import express from "express";

import paymentAuthenticatedUser from "./payment.authenticatedUser.routes.js";
import paymentWebhookRouter from "./payment.webhook.routes.js";

///////////////////////////////////////////////////////////////
// create router

const paymentRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount payment webhook routes

paymentRouter.use("/webhooks", paymentWebhookRouter);

///////////////////////////////////////////////////////////////
// mount student payment private routes

paymentRouter.use(paymentAuthenticatedUser);

///////////////////////////////////////////////////////////////
// export

export default paymentRouter;
