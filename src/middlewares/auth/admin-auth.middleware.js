import { ROLES } from "../../features/user/user.constants.js";
import * as authMiddlewares from "./auth.middleware.js";

const adminAuthMiddleware = Object.freeze([
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.ADMIN),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
]);

export default adminAuthMiddleware;
