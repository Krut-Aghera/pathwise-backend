import { Section, Img, Hr } from "react-email";
import { COLORS, COMPANY, LOGO, SPACING } from "../theme.js";
import { env_emailVars } from "../../config/env.config.js";

const EmailHeader = () => {
    return (
        <>
            <Section
                style={{
                    padding: `${SPACING.lg} ${SPACING.lg} ${SPACING.md}`,
                    textAlign: "center",
                }}
            >
                <Img
                    src={env_emailVars.EMAIL_LOGO_URL}
                    alt={COMPANY.name}
                    width={LOGO.width}
                    style={{
                        display: "block",
                        margin: "0 auto",
                    }}
                />
            </Section>

            <Hr
                style={{
                    borderColor: COLORS.border,
                    margin: 0,
                }}
            />
        </>
    );
};

export default EmailHeader;
