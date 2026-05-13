import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

interface VerifyEmailEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerifyEmailEmail({ name, verificationUrl }: VerifyEmailEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <Heading as="h2" style={emailStyles.heading}>
        Verify your email address
      </Heading>

      <Text style={emailStyles.text}>Hello {name},</Text>

      <Text style={emailStyles.text}>
        Thank you for signing up. To activate your account, please confirm your email address by
        clicking the button below.
      </Text>

      <Button href={verificationUrl} style={emailStyles.button}>
        Verify my email
      </Button>

      <Text style={emailStyles.text}>
        This link will expire in 24 hours. If you didn&apos;t create an account, you can ignore this
        email.
      </Text>

      <Text style={emailStyles.text}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <a href={verificationUrl} style={emailStyles.link}>
          {verificationUrl}
        </a>
      </Text>
    </EmailLayout>
  );
}

export default VerifyEmailEmail;
