/// <reference types="@cloudflare/workers-types" />
import { treaty } from "@elysiajs/eden";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { Miniflare } from "miniflare";
// `bg add` rewrites the scope in these lines, so the formatter cannot know how wide they are.
// oxfmt-ignore
import { authMacroPlugin, createAuth } from "{{SCOPE}}/auth";
// oxfmt-ignore
import * as authSchema from "{{SCOPE}}/auth/schema";
// oxfmt-ignore
import { createTestDb } from "{{SCOPE}}/db/testing";
import { R2_BINDING, bindR2 } from "./bucket";
import { mediaPlugin } from "./media.module";
import * as storageSchema from "./schema";

/** The public url a test serves files under: the `R2_PUBLIC_URL` of a test project. */
export const TEST_PUBLIC_URL = "https://media.example.com";

const API_URL = "http://api.test";
const APP_URL = "http://spa.test";
const PASSWORD = "correct horse battery staple";

/**
 * A real R2 bucket, which is what Miniflare runs workerd's for: no stand-in, no mock. One per test
 * file is enough, since `empty()` clears it between tests; `dispose()` stops workerd.
 */
export async function startTestBucket() {
  const miniflare = new Miniflare({
    modules: true,
    script: "export default {}",
    r2Buckets: { [R2_BINDING]: "r2-test" },
  });
  const bucket = bindR2({ [R2_BINDING]: await miniflare.getR2Bucket(R2_BINDING) });
  if (bucket === undefined) {
    throw new Error(`Miniflare gave no R2 bucket for ${R2_BINDING}`);
  }
  return {
    bucket,
    async empty() {
      const { objects } = await bucket.list();
      if (objects.length > 0) {
        await bucket.delete(objects.map(({ key }) => key));
      }
    },
    dispose: () => miniflare.dispose(),
  };
}

/**
 * The media routes over a fresh in-memory SQLite database that has the auth and the media tables, a
 * real Better Auth instance for the sessions, and the bucket the test brings (or none). Nothing is
 * mocked: the requests go through the plugin `apps/api` mounts, and what it stores lands in the
 * database the test reads back.
 */
export async function createTestStorage(bucket: R2Bucket | undefined) {
  const db = await createTestDb({ ...authSchema, ...storageSchema });
  const auth = createAuth({
    db,
    secret: "test-auth-secret-min-32-chars-long!!",
    baseURL: API_URL,
    appURL: APP_URL,
    trustedOrigins: [APP_URL],
    clientIpHeaders: ["x-test-client-ip"],
    mailer: {
      async sendVerificationEmail() {},
      async sendPasswordReset() {},
    },
    logger: { info() {}, warn() {}, error() {} },
  });
  const app = new Elysia().use(
    mediaPlugin(
      async () => ({ db, bucket, publicUrl: TEST_PUBLIC_URL }),
      authMacroPlugin(async () => ({ auth, db })),
    ),
  );

  /** Signs a verified user up and in: its id, and the cookie of that session. */
  async function signUp(email: string) {
    const { user } = await auth.api.signUpEmail({
      body: { email, password: PASSWORD, name: email },
    });
    await db
      .update(authSchema.user)
      .set({ emailVerified: true })
      .where(eq(authSchema.user.id, user.id));
    const response = await auth.api.signInEmail({
      body: { email, password: PASSWORD },
      asResponse: true,
    });
    const cookie = response.headers
      .getSetCookie()
      .map((entry) => entry.split(";")[0])
      .join("; ");
    return { userId: user.id, cookie };
  }

  /** `userId` as a member of the organization `orgId`, with `role`. */
  async function addMember(orgId: string, userId: string, role: "owner" | "admin" | "member") {
    await db.insert(authSchema.member).values({
      id: `member-${orgId}-${userId}`,
      organizationId: orgId,
      userId,
      role,
      createdAt: new Date(),
    });
  }

  /** An organization with `userId` as a member of `role`. */
  async function addOrganization(id: string, userId: string, role: "owner" | "admin" | "member") {
    await db
      .insert(authSchema.organization)
      .values({ id, name: `Org ${id}`, slug: `org-${id}`, createdAt: new Date() });
    await addMember(id, userId, role);
  }

  /** The Eden client of the routes, signed in as the session `cookie` holds, or anonymous. */
  function client(cookie?: string) {
    return treaty(app, { headers: cookie === undefined ? {} : { cookie } });
  }

  return { app, db, auth, signUp, addMember, addOrganization, client };
}
