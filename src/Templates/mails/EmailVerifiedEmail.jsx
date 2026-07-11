import { Heading, Section, Text } from "react-email";

import {
    COLORS,
    COMPANY,
    INFO_BOX_TYPES,
    SPACING,
    TYPOGRAPHY,
} from "../theme.js";

import BaseEmail from "../layouts/BaseEmail.jsx";
import EmailHeader from "../components/EmailHeader.jsx";
import EmailContent from "../components/EmailContent.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import InfoBox from "../components/InfoBox.jsx";
import EmailFooter from "../components/EmailFooter.jsx";

const EmailVerifiedEmail = ({ username, actionUrl }) => {
    return (
        <BaseEmail preview={`Your ${COMPANY.name} account has been verified`}>
            <EmailHeader />

            <EmailContent
                title="Email Verified Successfully 🎉"
                username={username}
            >
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Great news! Your email address has been successfully
                    verified and your <strong>{COMPANY.name}</strong> account is
                    now fully activated.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    You can now access all platform features, enroll in courses,
                    track your progress, and continue your learning journey.
                </Text>

                <PrimaryButton href={actionUrl}>Go to Dashboard</PrimaryButton>

                <InfoBox variant={INFO_BOX_TYPES.SUCCESS}>
                    Your account is now verified and ready to use.
                </InfoBox>

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

export default EmailVerifiedEmail;
