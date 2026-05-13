import { Resend } from "resend";

export function createResendClient(apiKey: string) {
  return new Resend(apiKey);
}

export async function sendEmail({
  resend,
  to,
  subject,
  from = "Bonne Garde <noreply@example.com>",
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
