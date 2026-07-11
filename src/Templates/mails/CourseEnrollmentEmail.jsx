import { Text } from "react-email";

import BaseEmail from "../layouts/BaseEmail.jsx";
import EmailHeader from "../components/EmailHeader.jsx";
import EmailContent from "../components/EmailContent.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import InfoBox from "../components/InfoBox.jsx";
import EmailFooter from "../components/EmailFooter.jsx";

import {
    COLORS,
    COMPANY,
    INFO_BOX_TYPES,
    SPACING,
    TYPOGRAPHY,
} from "../theme.js";

const CourseEnrollmentEmail = ({
    username,
    courseName,
    instructorName,
    actionUrl,
}) => {
    return (
        <BaseEmail preview={`You're enrolled in ${courseName}!`}>
            <EmailHeader />

            <EmailContent title="You're Enrolled! 🎉" username={username}>
                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    Congratulations! You've successfully enrolled in your new
                    course and can start learning right away.
                </Text>

                <Text
                    style={{
                        color: COLORS.textPrimary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                        marginTop: SPACING.lg,
                    }}
                >
                    <strong>Course</strong>
                    <br />
                    {courseName}
                </Text>

                <Text
                    style={{
                        color: COLORS.textPrimary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    <strong>Instructor</strong>
                    <br />
                    {instructorName}
                </Text>

                <PrimaryButton href={actionUrl}>Start Learning</PrimaryButton>

                <InfoBox variant={INFO_BOX_TYPES.SUCCESS}>
                    Your course is now available in your dashboard. Your
                    learning progress will be saved automatically as you
                    complete lessons.
                </InfoBox>

                <Text
                    style={{
                        color: COLORS.textPrimary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                        marginTop: SPACING.lg,
                        fontWeight: 600,
                    }}
                >
                    What's next?
                </Text>

                <Text
                    style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.body.fontSize,
                        lineHeight: TYPOGRAPHY.body.lineHeight,
                    }}
                >
                    • Open your dashboard.
                    <br />
                    • Start your first lesson.
                    <br />• Track your learning progress.
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
                    Happy Learning!
                    <br />
                    The {COMPANY.name} Team
                </Text>
            </EmailContent>

            <EmailFooter />
        </BaseEmail>
    );
};

export default CourseEnrollmentEmail;
