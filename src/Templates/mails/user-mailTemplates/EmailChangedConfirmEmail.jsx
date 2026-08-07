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

const EmailChangedConfirmEmail = ({ username }) => {
    return (
        <BaseEmail
            preview={`Your ${COMPANY.name} email address has been updated`}
        >
            <EmailHeader />

            <EmailContent title="Email Address Updated" username={username}>
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Your <strong>{COMPANY.name}</strong> account email address
                    has been updated successfully.
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
                        Your new email address is now associated with your
                        account and will be used for future sign-ins and
                        important account notifications.
                    </Text>
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    For your security, you've been signed out of your account.
                    Please sign in again using your new email address.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                    }}
                >
                    If you didn't make this change, please contact our support
                    team immediately.
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

export default EmailChangedConfirmEmail;
