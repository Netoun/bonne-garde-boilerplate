import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

interface InviteMemberEmailProps {
  orgName: string;
  inviterName: string;
  joinUrl: string;
}

export function InviteMemberEmail({ orgName, inviterName, joinUrl }: InviteMemberEmailProps) {
  return (
    <EmailLayout preview={`${inviterName} invited you to join ${orgName}`}>
      <Heading as="h2" style={emailStyles.heading}>
        {inviterName} invited you to join {orgName}
      </Heading>

      <Text style={emailStyles.text}>Hello,</Text>

      <Text style={emailStyles.text}>
        <strong>{inviterName}</strong> has invited you to join the <strong>{orgName}</strong>{" "}
        organization.
      </Text>

      <Button href={joinUrl} style={emailStyles.button}>
        Join the organization
      </Button>

      <Text style={emailStyles.text}>
        If you don&apos;t have an account yet, you can create one for free by clicking the link
        above.
      </Text>

      <Text style={emailStyles.text}>
        If you don&apos;t wish to join this organization or if you believe you received this email
        by mistake, you can simply ignore it.
      </Text>

      <Text style={emailStyles.text}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <a href={joinUrl} style={emailStyles.link}>
          {joinUrl}
        </a>
      </Text>
    </EmailLayout>
  );
}

export default InviteMemberEmail;
