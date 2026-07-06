import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

/**
 * Shared shell for every transactional email. Centralizing layout keeps tone
 * and accessibility (high contrast, large text) consistent across all mail.
 */
export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section>
            <Text style={brand}>Cordial</Text>
          </Section>
          {children}
          <Section>
            <Text style={footer}>
              You are receiving this email because you have an account with
              Cordial. If this was not you, you can safely ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#18181b",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const brand = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#1d4ed8",
  margin: "0 0 24px",
};

const footer = {
  fontSize: "13px",
  color: "#71717a",
  marginTop: "32px",
};
