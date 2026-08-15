import { ROLES } from "../../../features/user/user.constants.js";

import accessTokenVerification from "../tokens/access-token.verification.js";
import authorizeRole from "../roles/role.authorization.js";
import requireActiveAccount from "../states/active-account.require.js";
import requireVerifiedEmail from "../states/verify-email.require.js";

const studentAuthEngine = Object.freeze([
    accessTokenVerification,
    authorizeRole(ROLES.STUDENT),
    requireActiveAccount,
    requireVerifiedEmail
]);

export default studentAuthEngine;
