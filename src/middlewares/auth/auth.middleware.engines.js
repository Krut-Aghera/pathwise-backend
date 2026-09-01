import accessTokenVerification from "./tokens/access-token.verification.js";
import requireActiveAccount from "./states/active-account.require.js";
import requireVerifiedEmail from "./states/verify-email.require.js";
import authorizeRole from "./role.authorization.js";
import { ROLES } from "../../features/user/user.constants.js";

const userAuthEngine = Object.freeze([
    accessTokenVerification,
    requireActiveAccount,
    requireVerifiedEmail,
]);

const instructorAuthEngine = Object.freeze([
    accessTokenVerification,
    authorizeRole(ROLES.INSTRUCTOR, ROLES.ADMIN),
    requireActiveAccount,
    requireVerifiedEmail,
]);

const adminAuthEngine = Object.freeze([
    accessTokenVerification,
    authorizeRole(ROLES.ADMIN),
    requireActiveAccount,
    requireVerifiedEmail,
]);

export { userAuthEngine, instructorAuthEngine, adminAuthEngine };
