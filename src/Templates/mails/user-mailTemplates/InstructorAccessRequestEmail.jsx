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

const InstructorAccessRequestEmail = ({ username, actionUrl }) => {
    return (
        <BaseEmail
            preview={`Verify your instructor access request on ${COMPANY.name}`}
        >
            <EmailHeader />

            <EmailContent title="Verify Instructor Access" username={username}>
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    We received a request to enable instructor access for your{" "}
                    <strong>{COMPANY.name}</strong> account.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    To continue, please verify that this request was made by
                    you.
                </Text>

                <PrimaryButton href={actionUrl}>
                    Verify Instructor Access
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
                        This verification link will expire shortly for your
                        security. If you didn't request instructor access, you
                        can safely ignore this email.
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
                    Happy teaching,
                    <br />
                    The {COMPANY.name} Team
                </Text>
            </EmailContent>

            <EmailFooter />
        </BaseEmail>
    );
};

export default InstructorAccessRequestEmail;
