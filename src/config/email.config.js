import { MailtrapClient } from "mailtrap";
import { Resend } from "resend";

import { mailConfig, serverAppConfig } from "./env.config.js";

const mailtrapClient = new MailtrapClient({
    token: mailConfig.MAILTRAP_API_TOKEN,
});

const resendClient = new Resend(mailConfig.RESEND_API_KEY);

const emailProvider =
    serverAppConfig.NODE_ENV === "production" ? resendClient : mailtrapClient;

export default emailProvider;
