import { Text } from "react-email";

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

const EmailChangeVerificationEmail = ({ username, actionUrl }) => {
    return (
        <BaseEmail preview={`Confirm your new ${COMPANY.name} email address`}>
            <EmailHeader />

            <EmailContent
                title="Confirm Your New Email Address"
                username={username}
            >
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    We received a request to update the email address associated
                    with your <strong>{COMPANY.name}</strong> account.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    To complete this change, please verify ownership of your new
                    email address by clicking the button below.
                </Text>

                <PrimaryButton href={actionUrl}>
                    Confirm Email Address
                </PrimaryButton>

                <InfoBox variant={INFO_BOX_TYPES.WARNING}>
                    <Text
                        style={{
                            margin: 0,
                            color: COLORS.warning,
                            fontSize: TYPOGRAPHY.small.fontSize,
                            lineHeight: TYPOGRAPHY.small.lineHeight,
                            textAlign: "center",
                        }}
                    >
                        This verification link will expire in 15 minutes.
                    </Text>
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                    }}
                >
                    If you didn't request this change, you can safely ignore
                    this email. Your account email address will remain
                    unchanged.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                        textAlign: "center",
                        marginTop: SPACING.md,
                    }}
                >
                    Stay secure,
                    <br />
                    The {COMPANY.name} Team
                </Text>
            </EmailContent>

            <EmailFooter />
        </BaseEmail>
    );
};

export default EmailChangeVerificationEmail;
