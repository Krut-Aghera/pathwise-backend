import { MailtrapClient } from "mailtrap";
import { Resend } from "resend";

import { env_appVars } from "../../config/env.config.js";
import { env_emailVars } from "../../config/env.config.js";

export const isProduction = env_appVars.NODE_ENV === "production";

let emailProvider;

if (isProduction) {
    if (!env_emailVars.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is required in production.");
    }

    emailProvider = new Resend(env_emailVars.RESEND_API_KEY);
} else {
    if (!env_emailVars.MAILTRAP_API_TOKEN) {
        throw new Error("MAILTRAP_API_TOKEN is required in development.");
    }

    emailProvider = new MailtrapClient({
        token: env_emailVars.MAILTRAP_API_TOKEN,
        sandbox: true,
        testInboxId: env_emailVars.MAILTRAP_SANDBOX_ID,
    });
}

export default emailProvider;
