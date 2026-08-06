import { Resend } from "resend";
import { branding, formatEmailFrom } from "@acme/config";

const defaultEmailFrom = formatEmailFrom(branding.legalName, "noreply@example.com");

export function createResendClient(apiKey: string) {
  return new Resend(apiKey);
}

export async function sendEmail({
  resend,
  to,
  subject,
  from = defaultEmailFrom,
  react,
}: {
  resend: Resend;
  to: string;
  subject: string;
  from?: string;
  react: unknown;
}) {
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    // @ts-expect-error - react is unknown, but Resend will handle it
    react,
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }
}
