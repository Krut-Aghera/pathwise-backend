import { ROLES } from "../../../features/user/user.constants.js";

import authorizeRole from "../roles/role.authorization.js";
import requireActiveAccount from "../states/active-account.require.js";
import requireVerifiedEmail from "../states/verify-email.require.js";
import accessTokenVerification from "../tokens/access-token.verification.js";

const instructorAuthEngine = Object.freeze([
    accessTokenVerification,
    authorizeRole(ROLES.INSTRUCTOR),
    requireActiveAccount,
    requireVerifiedEmail,
]);

export default instructorAuthEngine;
