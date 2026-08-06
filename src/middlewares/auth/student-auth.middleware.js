import { ROLES } from "../../features/user/user.constants.js";
import * as authMiddlewares from "./auth.middleware.js";

const studentAuthMiddleware = Object.freeze([
    authMiddlewares.tokenVerificationEngine,
    authMiddlewares.authorizeRole(ROLES.STUDENT),
    authMiddlewares.requireActiveAccount,
    authMiddlewares.requireVerifiedEmail,
]);

export default studentAuthMiddleware;
