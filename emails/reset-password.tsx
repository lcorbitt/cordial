import { Button, Heading, Section, Text } from "@react-email/components";

import { EmailLayout } from "./components/email-layout";

export interface ResetPasswordProps {
  resetUrl: string;
}

export function ResetPassword({ resetUrl }: ResetPasswordProps) {
  return (
    <EmailLayout preview="Reset your password">
      <Heading style={heading}>Reset your password</Heading>
      <Text>
        We received a request to reset your Cordial password. Click the button
        below to choose a new one. This link expires in one hour.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={resetUrl} style={button}>
          Reset my password
        </Button>
      </Section>
      <Text style={{ fontSize: "14px", color: "#52525b" }}>
        If you did not request this, you can safely ignore this email. Your
        password will not change.
      </Text>
    </EmailLayout>
  );
}

export default ResetPassword;

export const resetPasswordSubject = "Reset your Cordial password";

const heading = { fontSize: "20px", fontWeight: 600 };
const button = {
  backgroundColor: "#1d4ed8",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 600,
  padding: "14px 28px",
  borderRadius: "8px",
  textDecoration: "none",
};
