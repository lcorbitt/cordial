import { Button, Heading, Section, Text } from "@react-email/components";

import { EmailLayout } from "./components/email-layout";

export interface VerifyEmailProps {
  verifyUrl: string;
}

export function VerifyEmail({ verifyUrl }: VerifyEmailProps) {
  return (
    <EmailLayout preview="Confirm your email address">
      <Heading style={heading}>Confirm your email address</Heading>
      <Text>
        Welcome to Cordial! Please confirm your email address so we know it is
        really you.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={verifyUrl} style={button}>
          Confirm my email
        </Button>
      </Section>
      <Text style={{ fontSize: "14px", color: "#52525b" }}>
        If the button does not work, copy and paste this link into your browser:
        <br />
        {verifyUrl}
      </Text>
    </EmailLayout>
  );
}

export default VerifyEmail;

export const verifyEmailSubject = "Confirm your Cordial email";

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
