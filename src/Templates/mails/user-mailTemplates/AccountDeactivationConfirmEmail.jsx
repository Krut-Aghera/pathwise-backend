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
import InfoBox from "../../components/InfoBox.jsx";
import EmailFooter from "../../components/EmailFooter.jsx";

const AccountDeactivationConfirmEmail = ({ username }) => {
    return (
        <BaseEmail
            preview={`Your ${COMPANY.name} account has been deactivated`}
        >
            <EmailHeader />

            <EmailContent title="Account Deactivated" username={username}>
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Your <strong>{COMPANY.name}</strong> account has been
                    successfully deactivated.
                </Text>

                <InfoBox variant={INFO_BOX_TYPES.SUCCESS}>
                    <Text
                        style={{
                            margin: 0,
                            color: COLORS.warning,
                            fontSize: TYPOGRAPHY.small.fontSize,
                            lineHeight: TYPOGRAPHY.small.lineHeight,
                            textAlign: "center",
                        }}
                    >
                        Your account is no longer accessible, and you have been
                        signed out from all active sessions.
                    </Text>
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    If this was not you, or you believe your account was
                    deactivated accidentally, please contact our support team as
                    soon as possible.
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
                    Thank you for being part of {COMPANY.name}.
                    <br />
                    We hope to see you again in the future.
                </Text>
            </EmailContent>

            <EmailFooter />
        </BaseEmail>
    );
};

export default AccountDeactivationConfirmEmail;
