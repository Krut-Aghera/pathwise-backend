import { MailtrapClient } from "mailtrap";
import { Resend } from "resend";

import { mailConfig, serverAppConfig } from "./env.config.js";

export const isProduction = serverAppConfig.NODE_ENV === "production";

let emailProvider;

if (isProduction) {
    if (!mailConfig.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is required in production.");
    }

    emailProvider = new Resend(mailConfig.RESEND_API_KEY);
} else {
    if (!mailConfig.MAILTRAP_API_TOKEN) {
        throw new Error("MAILTRAP_API_TOKEN is required in development.");
    }

    emailProvider = new MailtrapClient({
        token: mailConfig.MAILTRAP_API_TOKEN,
        sandbox: true,
        testInboxId: 4768443,
    });
}

export default emailProvider;
