import { Text } from "react-email";

import {
    COLORS,
    COMPANY,
    INFO_BOX_TYPES,
    SPACING,
    TYPOGRAPHY,
} from "../theme.js";

import BaseEmail from "../layouts/BaseEmail";
import EmailHeader from "../components/EmailHeader";
import EmailContent from "../components/EmailContent";
import PrimaryButton from "../components/PrimaryButton";
import InfoBox from "../components/InfoBox";
import EmailFooter from "../components/EmailFooter";

const ResetPasswordEmail = ({ username, actionUrl }) => {
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
                    This password reset link will expire in 15 minutes.
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

export default ResetPasswordEmail;
