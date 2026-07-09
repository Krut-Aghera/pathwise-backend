import { Html, Head, Preview, Body, Container } from "react-email";
import { COLORS, TYPOGRAPHY, LAYOUT, RADIUS } from "../theme.js";

const BaseEmail = ({ preview, children }) => {
    return (
        <Html>
            <Head />

            <Preview>{preview}</Preview>

            <Body
                style={{
                    margin: 0,
                    padding: "40px 20px",
                    backgroundColor: COLORS.background,
                    fontFamily: TYPOGRAPHY.fontFamily,
                }}
            >
                <Container
                    style={{
                        maxWidth: LAYOUT.maxWidth,
                        margin: "0 auto",
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.lg,
                        overflow: "hidden",
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    {children}
                </Container>
            </Body>
        </Html>
    );
};

export default BaseEmail;
