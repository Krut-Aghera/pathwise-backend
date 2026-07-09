import { Section, Heading, Text } from "react-email";

import BaseEmail from "../../emails/layouts/BaseEmail";
import EmailHeader from "../../emails/components/EmailHeader";
import EmailFooter from "../../emails/components/EmailFooter";
import PrimaryButton from "../../emails/components/PrimaryButton";
import EmailContent from "../components/EmailContent";

const WelcomeEmail = ({ username, actionUrl }) => {
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

                <PrimaryButton href={actionUrl}>Your Profile</PrimaryButton>

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

export default WelcomeEmail;
