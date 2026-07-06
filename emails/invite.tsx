import { Button, Heading, Section, Text } from "@react-email/components";

import { EmailLayout } from "./components/email-layout";

export interface InviteProps {
  inviterName: string;
  acceptUrl: string;
  communityName?: string;
}

export function Invite({ inviterName, acceptUrl, communityName }: InviteProps) {
  return (
    <EmailLayout preview="You have been invited to Cordial">
      <Heading style={heading}>You have an invitation</Heading>
      <Text>
        {inviterName} has invited you to join
        {communityName ? ` ${communityName} on` : ""} Cordial.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={acceptUrl} style={button}>
          Accept invitation
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default Invite;

export const inviteSubject = "Your Cordial invitation";

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
