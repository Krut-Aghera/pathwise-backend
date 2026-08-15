import { render } from "@react-email/render";
import { env_appVars } from "../../config/env.config.js";

const renderEmail = async (emailTemplate) => {
    if (!emailTemplate) {
        throw new Error("renderEmail requires an email template");
    }

    return await render(emailTemplate, {
        pretty: env_appVars.NODE_ENV !== "production",
    });
};

export default renderEmail;
