import { Text } from "react-email";

import BaseEmail from "../../layouts/BaseEmail.jsx";
import EmailHeader from "../../components/EmailHeader.jsx";
import EmailContent from "../../components/EmailContent.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import InfoBox from "../../components/InfoBox.jsx";
import EmailFooter from "../../components/EmailFooter.jsx";

import {
    COLORS,
    COMPANY,
    INFO_BOX_TYPES,
    SPACING,
    TYPOGRAPHY,
} from "../../theme.js";

const PasswordResetConfirmEmail = ({ username, actionUrl }) => {
    return (
        <BaseEmail preview={`Your ${COMPANY.name} password has been updated`}>
            <EmailHeader />

            <EmailContent
                title="Password Updated Successfully"
                username={username}
            >
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Your password has been reset successfully. You can now sign
                    in using your new password.
                </Text>

                <PrimaryButton href={actionUrl}>Sign In</PrimaryButton>

                <InfoBox variant={INFO_BOX_TYPES.DANGER}>
                    <Text
                        style={{
                            margin: 0,
                            color: COLORS.warning,
                            fontSize: TYPOGRAPHY.small.fontSize,
                            lineHeight: TYPOGRAPHY.small.lineHeight,
                            textAlign: "center",
                        }}
                    >
                        If you didn't make this change, contact our support team
                        immediately and secure your account.
                    </Text>
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
                    Stay secure,
                    <br />
                    The {COMPANY.name} Team
                </Text>
            </EmailContent>

            <EmailFooter />
        </BaseEmail>
    );
};

export default PasswordResetConfirmEmail;
