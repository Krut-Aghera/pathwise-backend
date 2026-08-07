import { Text } from "react-email";

import {
    COLORS,
    COMPANY,
    INFO_BOX_TYPES,
    SPACING,
    TYPOGRAPHY,
} from "../../theme.js";

import BaseEmail from "../../layouts/BaseEmail.jsx";
import EmailHeader from "../../components/EmailHeader.jsx";
import EmailContent from "../../components/EmailContent.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import InfoBox from "../../components/InfoBox.jsx";
import EmailFooter from "../../components/EmailFooter.jsx";

const PasswordResetRequestEmail = ({ username, actionUrl }) => {
    return (
        <BaseEmail preview={`Reset your ${COMPANY.name} password`}>
            <EmailHeader />

            <EmailContent title="Reset Your Password" username={username}>
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    We received a request to reset the password for your{" "}
                    <strong>{COMPANY.name}</strong> account.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Click the button below to create a new password. For your
                    security, this link can only be used once.
                </Text>

                <PrimaryButton href={actionUrl}>Reset Password</PrimaryButton>

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
                        This password reset link will expire in 15 minutes.
                    </Text>
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                    }}
                >
                    If you didn't request a password reset, you can safely
                    ignore this email. Your password will remain unchanged.
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

export default PasswordResetRequestEmail;
