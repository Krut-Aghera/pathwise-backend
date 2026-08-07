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

const InstructorAccessConfirmEmail = ({ username }) => {
    return (
        <BaseEmail
            preview={`Your instructor access has been activated on ${COMPANY.name}`}
        >
            <EmailHeader />

            <EmailContent title="Instructor Access Granted" username={username}>
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Congratulations! Your <strong>{COMPANY.name}</strong>{" "}
                    account now has instructor access.
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
                        You can now create, manage, and publish courses, upload
                        learning materials, and begin teaching students on{" "}
                        {COMPANY.name}.
                    </Text>
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    We're excited to have you as an instructor and can't wait to
                    see the knowledge you'll share with learners around the
                    world.
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.small.fontSize,
                        lineHeight: TYPOGRAPHY.small.lineHeight,
                    }}
                >
                    If you weren't expecting this change, please contact our
                    support team immediately.
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
                    Happy teaching,
                    <br />
                    The {COMPANY.name} Team
                </Text>
            </EmailContent>

            <EmailFooter />
        </BaseEmail>
    );
};

export default InstructorAccessConfirmEmail;
