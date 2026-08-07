import { Section, Heading, Text } from "react-email";

import { COLORS, COMPANY, SPACING, TYPOGRAPHY } from "../../theme.js";

import BaseEmail from "../../layouts/BaseEmail.jsx";
import EmailHeader from "../../components/EmailHeader.jsx";
import EmailContent from "../../components/EmailContent.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import EmailFooter from "../../components/EmailFooter.jsx";

const RegistrationEmail = ({ username, actionUrl }) => {
    return (
        <BaseEmail preview={`Welcome to ${COMPANY.name}!`}>
            <EmailHeader />

            <EmailContent
                title={`Welcome to ${COMPANY.name}! 🎉`}
                username={username}
            >
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    We're excited to have you join{" "}
                    <strong>{COMPANY.name}</strong>. Your account has been
                    created successfully and you're ready to begin your learning
                    journey.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Explore courses, track your progress, and build valuable
                    skills at your own pace.
                </Text>

                <Text
                    style={{
                        color: COLORS.warning,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                        fontWeight: 600,
                    }}
                >
                    Verify your email to access all resources. Chekcout "Email
                    Verification" in your Dashboard
                </Text>

                <PrimaryButton href={actionUrl}>Dashboard</PrimaryButton>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                        textAlign: "center",
                        marginTop: SPACING.md,
                    }}
                >
                    Happy Learning!
                    <br />
                    The {COMPANY.name} Team
                </Text>
            </EmailContent>
            <EmailFooter />
        </BaseEmail>
    );
};

export default RegistrationEmail;
