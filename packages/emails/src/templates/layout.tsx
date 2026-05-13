import type { ReactNode } from "react";
import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface EmailLayoutProps {
  preview?: string;
  children: ReactNode;
}

const PRIMARY = "#3B82F6";
const FOREGROUND = "#1F2937";
const MUTED_TEXT = "#6B7280";
const BACKGROUND = "#F9FAFB";
const BORDER = "#E5E7EB";

export { PRIMARY, FOREGROUND, MUTED_TEXT, BACKGROUND, BORDER };

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="fr">
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.logoText}>Bonne Garde</Text>
          </Section>
          <Section style={styles.content}>{children}</Section>
          <Section style={styles.footer}>
            <Hr style={styles.hr} />
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Bonne Garde. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  heading: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "26px",
    fontWeight: "600",
    color: FOREGROUND,
    letterSpacing: "-0.02em",
    lineHeight: "1.25",
    margin: "0 0 24px 0",
    textAlign: "left" as const,
  },
  text: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "26px",
    color: MUTED_TEXT,
    margin: "0 0 16px 0",
    textAlign: "left" as const,
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: "12px",
    color: "#ffffff",
    display: "inline-block",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "52px",
    textAlign: "center" as const,
    textDecoration: "none",
    width: "100%",
    maxWidth: "300px",
    margin: "24px 0",
  },
  link: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: PRIMARY,
    textDecoration: "underline",
    wordBreak: "break-all" as const,
  },
};

const styles = {
  main: {
    backgroundColor: BACKGROUND,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    margin: "0 auto",
    padding: "32px 0 56px",
    maxWidth: "600px",
  },
  header: {
    padding: "28px 32px",
    backgroundColor: "#ffffff",
    borderRadius: "16px 16px 0 0",
    borderBottom: `3px solid ${PRIMARY}`,
  },
  logoText: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: FOREGROUND,
    margin: "0",
  },
  content: {
    padding: "36px 32px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 24px rgba(59, 130, 246, 0.08)",
  },
  footer: {
    padding: "20px 32px 24px",
    backgroundColor: BACKGROUND,
    borderRadius: "0 0 16px 16px",
  },
  hr: {
    borderColor: BORDER,
    margin: "0 0 20px 0",
  },
  footerText: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "12px",
    lineHeight: "18px",
    color: MUTED_TEXT,
    textAlign: "center" as const,
    margin: "0",
  },
};
