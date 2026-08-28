import express from "express";

import wishlistAuthenticatedUser from "./wishlist.authenticatedUser.routes.js";

///////////////////////////////////////////////////////////////
// create router

const wishlistRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount student routes

wishlistRouter.use(wishlistAuthenticatedUser);

///////////////////////////////////////////////////////////////
// export

export default wishlistRouter;
