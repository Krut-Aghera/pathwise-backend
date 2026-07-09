import { Text } from "react-email";

import BaseEmail from "../layouts/BaseEmail";
import EmailHeader from "../components/EmailHeader";
import EmailContent from "../components/EmailContent";
import PrimaryButton from "../components/PrimaryButton";
import InfoBox from "../components/InfoBox";
import EmailFooter from "../components/EmailFooter";

import {
    COLORS,
    COMPANY,
    INFO_BOX_TYPES,
    SPACING,
    TYPOGRAPHY,
} from "../theme.js";

const PasswordResetSuccessEmail = ({ username, actionUrl }) => {
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
                    Your password has been changed successfully. You can now
                    sign in using your new password.
                </Text>

                <PrimaryButton href={actionUrl}>Sign In</PrimaryButton>

                <InfoBox variant={INFO_BOX_TYPES.DANGER}>
                    If you didn't make this change, contact our support team
                    immediately and secure your account.
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

export default PasswordResetSuccessEmail;
