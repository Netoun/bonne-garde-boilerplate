import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

interface InviteMemberEmailProps {
  orgName: string;
  inviterName: string;
  joinUrl: string;
}

export function InviteMemberEmail({ orgName, inviterName, joinUrl }: InviteMemberEmailProps) {
  return (
    <EmailLayout preview={`${inviterName} vous invite à rejoindre ${orgName}`}>
      <Heading as="h2" style={emailStyles.heading}>
        {inviterName} vous invite à rejoindre {orgName}
      </Heading>

      <Text style={emailStyles.text}>Bonjour,</Text>

      <Text style={emailStyles.text}>
        <strong>{inviterName}</strong> vous invite à rejoindre l&apos;organisation{" "}
        <strong>{orgName}</strong>.
      </Text>

      <Button href={joinUrl} style={emailStyles.button}>
        Rejoindre l&apos;organisation
      </Button>

      <Text style={emailStyles.text}>
        Si vous n&apos;avez pas de compte, vous pourrez en créer un gratuitement en cliquant sur le
        lien ci-dessus.
      </Text>

      <Text style={emailStyles.text}>
        Si vous ne souhaitez pas rejoindre cette organisation ou si vous pensez avoir reçu cet email
        par erreur, vous pouvez l&apos;ignorer.
      </Text>

      <Text style={emailStyles.text}>
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
        <br />
        <a href={joinUrl} style={emailStyles.link}>
          {joinUrl}
        </a>
      </Text>
    </EmailLayout>
  );
}

export default InviteMemberEmail;
