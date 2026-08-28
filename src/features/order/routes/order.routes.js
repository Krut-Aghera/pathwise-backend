import express from "express";

import orderAuthenticatedUser from "./order.authenticatedUser.routes.js";

///////////////////////////////////////////////////////////////
// create router

const orderRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount student private routes

orderRouter.use("/students", orderAuthenticatedUser);

///////////////////////////////////////////////////////////////
// export

export default orderRouter;
