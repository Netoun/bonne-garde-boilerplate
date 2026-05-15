import type { EmailMessage, EmailProvider } from "../types";

export type CloudflareEmailSender = (message: EmailMessage) => Promise<void>;

export function createCloudflareEmailProvider(sender: CloudflareEmailSender): EmailProvider {
  return {
    async send(message: EmailMessage) {
      await sender(message);
    },
  };
}
