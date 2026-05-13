import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./layout";

interface VerifyEmailEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerifyEmailEmail({ name, verificationUrl }: VerifyEmailEmailProps) {
  return (
    <EmailLayout preview="Vérifiez votre adresse email">
      <Heading as="h2" style={emailStyles.heading}>
        Vérifiez votre adresse email
      </Heading>

      <Text style={emailStyles.text}>Bonjour {name},</Text>

      <Text style={emailStyles.text}>
        Merci de vous être inscrit. Pour activer votre compte, confirmez votre adresse email en
        cliquant sur le bouton ci-dessous.
      </Text>

      <Button href={verificationUrl} style={emailStyles.button}>
        Vérifier mon email
      </Button>

      <Text style={emailStyles.text}>
        Ce lien expirera dans 24 heures. Si vous n&apos;avez pas créé de compte, vous pouvez ignorer
        cet email.
      </Text>

      <Text style={emailStyles.text}>
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
        <br />
        <a href={verificationUrl} style={emailStyles.link}>
          {verificationUrl}
        </a>
      </Text>
    </EmailLayout>
  );
}

export default VerifyEmailEmail;
