import emailProvider, { isProduction } from "./email.config.js";
import { mailConfig } from "../../config/env.config.js";
import logger from "../../utils/pinoLogger.js";

const sendEmail = async ({ to, subject, html }) => {
    if (!to || !subject || !html) {
        throw new Error("sendEmail requires 'to', 'subject', and 'html'.");
    }

    const providerName = isProduction ? "Resend" : "Mailtrap";

    try {
        if (isProduction) {
            await emailProvider.emails.send({
                from: mailConfig.RESEND_FROM_EMAIL,
                to,
                subject,
                html,
            });
        } else {
            await emailProvider.send({
                from: {
                    email: mailConfig.MAILTRAP_SENDER_EMAIL,
                    name: mailConfig.MAILTRAP_SENDER_NAME,
                },
                to: [{ email: to }],
                subject,
                html,
            });
        }

        logger.info(
            {
                provider: providerName,
                recipient: to,
                subject,
            },
            "Email sent successfully"
        );
    } catch (error) {
        logger.error(
            {
                err: error,
                provider: providerName,
                recipient: to,
                subject,
            },
            "Failed to send email"
        );

        throw error;
    }
};

export default sendEmail;
