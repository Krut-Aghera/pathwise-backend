import express from "express";

import paymentAuthenticatedUser from "./payment.authenticatedUser.routes.js";
import paymentWebhookRouter from "./payment.webhook.routes.js";

const paymentRouter = express.Router();

paymentRouter.use("/webhooks", paymentWebhookRouter);
paymentRouter.use(paymentAuthenticatedUser);

export default paymentRouter;
