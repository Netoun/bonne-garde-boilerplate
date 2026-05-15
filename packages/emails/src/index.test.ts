import { expect, test } from "bun:test";
import {
  createMemoryEmailProvider,
  renderEmailTemplate,
  sendEmail,
  WelcomeTemplate,
} from "./index";

test("memory provider captures emails", async () => {
  const sent: Array<{ to: string; subject: string; html: string }> = [];
  const provider = createMemoryEmailProvider(sent);

  await sendEmail(provider, {
    to: "test@example.com",
    subject: "Welcome",
    html: "<p>Hello</p>",
  });

  expect(sent.length).toBe(1);
  expect(sent[0]?.to).toBe("test@example.com");
});

test("react-email template renders html", async () => {
  const html = await renderEmailTemplate(WelcomeTemplate, {
    appName: "Bonne Garde",
    userName: "Neto",
    ctaUrl: "https://example.com",
  });

  expect(html.includes("Bienvenue sur Bonne Garde")).toBeTrue();
  expect(html.includes("https://example.com")).toBeTrue();
});
