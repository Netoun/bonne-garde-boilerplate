// oxlint-disable no-console
import { betterAuth } from "better-auth";
import { scrypt, randomBytes } from "node:crypto";
import { organization } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { eq, and, isNull } from "drizzle-orm";
import { createDB } from "@bonne-garde/api/modules/db/db.client";
import {
  authSchema,
  member,
  organization as orgTable,
} from "@bonne-garde/api/modules/db/schemas/db.auth-schema";
import { createResendClient, sendEmail } from "@bonne-garde/api/lib/email";
import { VerifyEmailEmail, ResetPasswordEmail } from "@bonne-garde/emails";
import { config } from "@bonne-garde/api/lib/app.config";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err);
      else resolve(`${salt}:${derived.toString("hex")}`);
    });
  });
}

function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err);
      else resolve(derived.toString("hex") === key);
    });
  });
}

export function createAuth() {
  const db = createDB(config.DB);
  const resend = createResendClient(config.RESEND_API_KEY);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: authSchema,
    }),
    secret: config.BETTER_AUTH_SECRET,
    baseURL: config.API_URL,
    basePath: "/auth",
    trustedOrigins: [config.BO_URL, config.PLAYER_URL].filter(Boolean) as string[],
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      password: {
        hash: hashPassword,
        verify: ({ password, hash }) => verifyPassword(password, hash),
      },
      sendResetPassword: async ({ user, token }) => {
        try {
          // Build BO URL with token as query param (matches /auth/reset-password route)
          const resetUrl = new URL("/auth/reset-password", config.BO_URL);
          resetUrl.searchParams.set("token", token);

          await sendEmail({
            resend,
            to: user.email,
            subject: "Réinitialisation de votre mot de passe",
            react: ResetPasswordEmail({
              name: user.name || user.email,
              resetUrl: resetUrl.toString(),
            }),
          });
        } catch (error) {
          console.error("Failed to send reset password email:", error);
          throw error;
        }
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, token }) => {
        try {
          // Build BO URL with token as query param (matches /auth/verify-email route)
          const verificationUrl = new URL("/auth/verify-email", config.BO_URL);
          verificationUrl.searchParams.set("token", token);

          await sendEmail({
            resend,
            to: user.email,
            subject: "Vérifiez votre adresse email",
            react: VerifyEmailEmail({
              name: user.name || user.email,
              verificationUrl: verificationUrl.toString(),
            }),
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
          throw error;
        }
      },
    },
    databaseHooks: {
      // Hook: Create default organization after user signup
      user: {
        create: {
          after: async (user) => {
            try {
              const orgId = crypto.randomUUID();
              const orgName = "Personal";
              const orgSlug = generateSlug(orgName);

              // Create default organization
              await db.insert(orgTable).values({
                id: orgId,
                name: orgName,
                slug: orgSlug,
                createdAt: new Date(),
                settings: {},
              });

              // Add user as owner
              await db.insert(member).values({
                id: crypto.randomUUID(),
                organizationId: orgId,
                userId: user.id,
                role: "owner",
                createdAt: new Date(),
              });

              console.log(
                `[Auth] Created default organization "${orgName}" (${orgId}) for user ${user.id}`,
              );
            } catch (error) {
              console.error("[Auth] Failed to create default organization:", error);
              // Don't throw - user creation should not fail if org creation fails
            }
          },
        },
      },
      // Hook: Set active organization on session creation (login)
      session: {
        create: {
          before: async (session) => {
            try {
              // Get first organization for this user
              const userOrg = await db
                .select({
                  orgId: orgTable.id,
                })
                .from(member)
                .leftJoin(orgTable, eq(member.organizationId, orgTable.id))
                .where(and(eq(member.userId, session.userId), isNull(orgTable.deletedAt)))
                .limit(1);

              if (userOrg.length > 0 && userOrg[0]?.orgId) {
                const newSession = {
                  ...session,
                  activeOrganizationId: userOrg[0].orgId,
                };
                console.log(
                  `[Auth] Auto-setting active organization ${userOrg[0].orgId} for user ${session.userId}`,
                );
                return {
                  data: newSession,
                };
              }

              return { data: session };
            } catch (error) {
              console.error("[Auth] Failed to set active organization:", error);
              return { data: session };
            }
          },
        },
      },
    },
    plugins: [organization()],
  });
}

export type Auth = ReturnType<typeof createAuth>;
