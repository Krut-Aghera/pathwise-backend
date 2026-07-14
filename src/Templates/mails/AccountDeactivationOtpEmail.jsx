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
import InfoBox from "../components/InfoBox.jsx";
import EmailFooter from "../components/EmailFooter.jsx";

const AccountDeactivationOtpEmail = ({ username, otp }) => {
    return (
        <BaseEmail
            preview={`Confirm your ${COMPANY.name} account deactivation`}
        >
            <EmailHeader />

            <EmailContent
                title="Confirm Account Deactivation"
                username={username}
            >
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    We received a request to deactivate your{" "}
                    <strong>{COMPANY.name}</strong> account.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Please enter the verification code below to confirm this
                    action.
                </Text>

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
                        {otp}
                    </Text>
                </InfoBox>

                <InfoBox variant={INFO_BOX_TYPES.WARNING}>
                    This verification code will expire in 10 minutes.
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                    }}
                >
                    If you didn't request account deactivation, please ignore
                    this email. Your account will remain active.
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

export default AccountDeactivationOtpEmail;
