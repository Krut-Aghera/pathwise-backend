import { MailtrapClient } from "mailtrap";
import { Resend } from "resend";

import { serverAppConfig } from "../../config/env.config.js";
import { EMAIL_ENV } from "./email.constans.js";

export const isProduction = serverAppConfig.NODE_ENV === "production";

let emailProvider;

if (isProduction) {
    if (!EMAIL_ENV.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is required in production.");
    }

    emailProvider = new Resend(EMAIL_ENV.RESEND_API_KEY);
} else {
    if (!EMAIL_ENV.MAILTRAP_API_TOKEN) {
        throw new Error("MAILTRAP_API_TOKEN is required in development.");
    }

    emailProvider = new MailtrapClient({
        token: EMAIL_ENV.MAILTRAP_API_TOKEN,
        sandbox: true,
        testInboxId: EMAIL_ENV.MAILTRAP_SANDBOX_ID,
    });
}

export default emailProvider;
