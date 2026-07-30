import { ROLES } from "../../features/user/user.constants.js";
import * as authMiddlewares from "./auth.middleware.js";

const instructorAuthMiddleware = Object.freeze([
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.INSTRUCTOR),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
]);

export default instructorAuthMiddleware;
