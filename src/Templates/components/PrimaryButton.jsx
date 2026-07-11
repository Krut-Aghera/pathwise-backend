import { Button, Section } from "react-email";
import { BUTTON, COLORS, SPACING, TYPOGRAPHY } from "../theme.js";

const PrimaryButton = ({ href, children }) => {
    return (
        <Section
            style={{
                textAlign: "center",
                padding: `${SPACING.md} ${SPACING.lg}`,
            }}
        >
            <Button
                href={href}
                style={{
                    display: "inline-block",
                    backgroundColor: COLORS.primary,
                    color: COLORS.textLight,
                    padding: "14px 28px",
                    borderRadius: BUTTON.radius,
                    fontSize: TYPOGRAPHY.body.fontSize,
                    fontWeight: 600,
                    textDecoration: "none",
                }}
            >
                {children}
            </Button>
        </Section>
    );
};

export default PrimaryButton;
