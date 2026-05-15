export type { EmailMessage, EmailProvider, EmailTemplateProps } from "./types";

export { createMemoryEmailProvider } from "./providers/memory.provider";
export { createCloudflareEmailProvider } from "./providers/cloudflare.provider";

export { renderEmailTemplate } from "./render";
export type { EmailTemplate } from "./render";

export { sendEmail } from "./send";

export { WelcomeTemplate } from "./templates/welcome.template";
export type { WelcomeTemplateProps } from "./templates/welcome.template";
export { VerifyEmailEmail } from "./templates/verify-email.template";
export type { VerifyEmailTemplateProps } from "./templates/verify-email.template";
export { ResetPasswordEmail } from "./templates/reset-password.template";
export type { ResetPasswordTemplateProps } from "./templates/reset-password.template";
