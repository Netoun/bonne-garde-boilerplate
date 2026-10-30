import { describe, it, expect } from "bun:test";
import { TEST_API_URL, createTestAuth } from "./testing";

describe("createAuth security defaults", () => {
  it("keeps origin and CSRF protection on, also under NODE_ENV=test", async () => {
    const { auth } = await createTestAuth();
    const context = await auth.$context;

    expect(context.skipOriginCheck).toBe(false);
    expect(context.skipCSRFCheck).toBe(false);
  });

  it("issues httpOnly, lax session cookies, Secure only over https", async () => {
    const { auth } = await createTestAuth();
    const context = await auth.$context;

    expect(context.authCookies.sessionToken.attributes).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: TEST_API_URL.startsWith("https://"),
    });
  });
});
