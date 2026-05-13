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
  expiresIn = "24 heures",
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Réinitialisation de votre mot de passe">
      <Heading as="h2" style={emailStyles.heading}>
        Réinitialisation de votre mot de passe
      </Heading>

      <Text style={emailStyles.text}>Bonjour {name},</Text>

      <Text style={emailStyles.text}>
        Vous avez demandé une réinitialisation de votre mot de passe. Pour définir un nouveau mot de
        passe, cliquez sur le bouton ci-dessous.
      </Text>

      <Button href={resetUrl} style={emailStyles.button}>
        Réinitialiser mon mot de passe
      </Button>

      <Text style={emailStyles.text}>Ce lien expirera dans {expiresIn}.</Text>

      <Text style={securityText}>
        <strong>Important :</strong> Si vous n&apos;avez pas fait cette demande, vous pouvez ignorer
        cet email en toute sécurité. Votre mot de passe actuel restera inchangé.
      </Text>

      <Text style={emailStyles.text}>
        Pour des raisons de sécurité, ne partagez jamais ce lien avec qui que ce soit.
      </Text>

      <Text style={emailStyles.text}>
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
        <br />
        <a href={resetUrl} style={emailStyles.link}>
          {resetUrl}
        </a>
      </Text>
    </EmailLayout>
  );
}

export default ResetPasswordEmail;
