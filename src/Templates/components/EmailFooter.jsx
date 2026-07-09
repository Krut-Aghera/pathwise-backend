import { Hr, Link, Section, Text } from "react-email";

import { COLORS, COMPANY, SPACING, TYPOGRAPHY } from "../theme.js";

const EmailFooter = () => {
    return (
        <>
            <Hr
                style={{
                    borderColor: COLORS.border,
                    margin: 0,
                }}
            />

            <Section
                style={{
                    padding: SPACING.lg,
                    textAlign: "center",
                }}
            >
                <Text
                    style={{
                        margin: "0 0 8px",
                        color: COLORS.textPrimary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                    }}
                >
                    Need help?
                </Text>

                <Link
                    href={`mailto:${COMPANY.supportEmail}`}
                    style={{
                        color: COLORS.primary,
                        textDecoration: "none",
                        fontSize: TYPOGRAPHY.small.fontSize,
                    }}
                >
                    {COMPANY.supportEmail}
                </Link>

                <Text
                    style={{
                        margin: "24px 0 8px",
                        color: COLORS.textSecondary,
                        fontSize: "13px",
                        lineHeight: "20px",
                    }}
                >
                    © {new Date().getFullYear()} {COMPANY.name}. All rights
                    reserved.
                </Text>

                <Text
                    style={{
                        margin: 0,
                        color: COLORS.textSecondary,
                        fontSize: "12px",
                        lineHeight: "18px",
                    }}
                >
                    You're receiving this email because you have an account with{" "}
                    {COMPANY.name}.
                </Text>
            </Section>
        </>
    );
};

export default EmailFooter;
