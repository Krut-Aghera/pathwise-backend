import { Heading, Section, Text } from "react-email";

import {
    COLORS,
    COMPANY,
    INFO_BOX_TYPES,
    SPACING,
    TYPOGRAPHY,
} from "../theme.js";

import BaseEmail from "../../emails/layouts/BaseEmail";
import EmailHeader from "../../emails/components/EmailHeader";
import EmailFooter from "../../emails/components/EmailFooter";
import PrimaryButton from "../../emails/components/PrimaryButton";
import InfoBox from "../../emails/components/InfoBox";
import EmailContent from "../components/EmailContent.jsx";

const VerifyEmail = ({ username, actionUrl }) => {
    return (
        <BaseEmail preview={`Verify your ${COMPANY.name} account`}>
            <EmailHeader />

            <EmailContent title="Verify Your Email Address" username={username}>
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Thanks for signing up for <strong>{COMPANY.name}</strong>.
                    To activate your account and access all features, please
                    verify your email address by clicking the button below.
                </Text>

                <PrimaryButton href={actionUrl}>Verify Email</PrimaryButton>

                <InfoBox variant={INFO_BOX_TYPES.WARNING}>
                    This verification link will expire in 24 hours.
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                        textAlign: "center",
                    }}
                >
                    If the button doesn't work, copy and paste this link into
                    your browser:
                </Text>

                <Text
                    style={{
                        wordBreak: "break-all",
                        color: COLORS.primary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                        textAlign: "center",
                    }}
                >
                    {actionUrl}
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                    }}
                >
                    If you didn't create a {COMPANY.name} account, you can
                    safely ignore this email. No further action is required.
                </Text>
            </EmailContent>
            <EmailFooter />
        </BaseEmail>
    );
};

export default VerifyEmail;
