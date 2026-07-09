import { Section, Text } from "react-email";
import {
    INFO_BOX_TYPES,
    INFO_BOX_VARIANTS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from "../theme.js";

const InfoBox = ({ variant = INFO_BOX_TYPES.DEFAULT, children }) => {
    const styles =
        INFO_BOX_VARIANTS[variant] ?? INFO_BOX_VARIANTS[INFO_BOX_TYPES.DEFAULT];

    return (
        <Section
            style={{
                margin: `${SPACING.md} ${SPACING.lg}`,
                padding: SPACING.md,
                backgroundColor: styles.background,
                border: `1px solid ${styles.border}`,
                borderRadius: RADIUS.md,
            }}
        >
            <Text
                style={{
                    margin: 0,
                    color: styles.text,
                    fontSize: TYPOGRAPHY.small.fontSize,
                    lineHeight: TYPOGRAPHY.small.lineHeight,
                    textAlign: "center",
                }}
            >
                {children}
            </Text>
        </Section>
    );
};

export default InfoBox;
