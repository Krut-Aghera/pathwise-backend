import { render } from "@react-email/render";
import { serverAppConfig } from "../../config/env.config";

const renderEmail = async (emailTemplate) => {
    if (!emailTemplate) {
        throw new Error("renderEmail requires an email template");
    }

    return await render(emailTemplate, {
        pretty: serverAppConfig.NODE_ENV !== "production",
    });
};

export default renderEmail;
