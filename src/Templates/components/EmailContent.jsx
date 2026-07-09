import { Heading, Section, Text } from "react-email";

import { COLORS, SPACING, TYPOGRAPHY } from "../theme.js";

const EmailContent = ({ title, username, children }) => {
    return (
        <Section
            style={{
                padding: SPACING.lg,
            }}
        >
            <Heading
                style={{
                    margin: 0,
                    color: COLORS.textPrimary,
                    fontSize: TYPOGRAPHY.heading.fontSize,
                    lineHeight: TYPOGRAPHY.heading.lineHeight,
                    fontWeight: TYPOGRAPHY.heading.fontWeight,
                    textAlign: "center",
                }}
            >
                {title}
            </Heading>

            {username && (
                <Text
                    style={{
                        marginTop: SPACING.lg,
                        color: COLORS.textPrimary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Hi {username},
                </Text>
            )}

            {children}
        </Section>
    );
};

export default EmailContent;
