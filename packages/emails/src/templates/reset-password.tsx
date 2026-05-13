import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles, MUTED_TEXT } from "./layout";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
  expiresIn?: string;
}

const securityText = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: "15px",
  fontWeight: "500" as const,
  lineHeight: "24px",
  color: MUTED_TEXT,
  margin: "24px 0",
  padding: "16px 20px",
  backgroundColor: "#F3F4F6",
  borderRadius: "10px",
  borderLeft: "3px solid #3B82F6",
  textAlign: "left" as const,
};

export function ResetPasswordEmail({
  name,
  resetUrl,
  expiresIn = "24 hours",
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Reset your password">
      <Heading as="h2" style={emailStyles.heading}>
        Reset your password
      </Heading>

      <Text style={emailStyles.text}>Hello {name},</Text>

      <Text style={emailStyles.text}>
        You requested a password reset. To set a new password, click the button below.
      </Text>

      <Button href={resetUrl} style={emailStyles.button}>
        Reset my password
      </Button>

      <Text style={emailStyles.text}>This link will expire in {expiresIn}.</Text>

      <Text style={securityText}>
        <strong>Important:</strong> If you didn&apos;t make this request, you can safely ignore this
        email. Your current password will remain unchanged.
      </Text>

      <Text style={emailStyles.text}>For security reasons, never share this link with anyone.</Text>

      <Text style={emailStyles.text}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <a href={resetUrl} style={emailStyles.link}>
          {resetUrl}
        </a>
      </Text>
    </EmailLayout>
  );
}

export default ResetPasswordEmail;
