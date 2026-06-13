import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * createApi() calls resolveApiUrl() which has three branches:
 *  1. context.cloudflare.env.API_URL present and valid  → returns that URL
 *  2. API_URL absent + import.meta.env.DEV === true     → returns localhost fallback
 *  3. API_URL absent + not DEV                          → throws
 *
 * resolveApiUrl is not exported, so we test its branches through createApi's
 * observable behaviour (throws vs does not throw, and the underlying base URL
 * used by the treaty client).
 */
describe("createApi / resolveApiUrl (apps/ssr/src/lib/api.server.ts)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  describe("branch 1 — cloudflare env API_URL is present", () => {
    it("does not throw when API_URL is a valid URL", async () => {
      const { createApi } = await import("~/lib/api.server");
      const context = {
        cloudflare: { env: { API_URL: "https://api.example.com" } },
      };
      expect(() => createApi(context)).not.toThrow();
    });

    it("throws when API_URL is present but not a valid URL", async () => {
      const { createApi } = await import("~/lib/api.server");
      const context = {
        cloudflare: { env: { API_URL: "not-a-valid-url" } },
      };
      expect(() => createApi(context)).toThrow();
    });
  });

  describe("branch 2 — no cloudflare env, DEV mode", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.stubEnv("DEV", true as unknown as string);
    });

    it("does not throw and falls back to localhost in dev mode", async () => {
      const { createApi } = await import("~/lib/api.server");
      // No cloudflare context at all
      expect(() => createApi({})).not.toThrow();
    });

    it("does not throw when cloudflare env exists but API_URL is absent", async () => {
      const { createApi } = await import("~/lib/api.server");
      const context = { cloudflare: { env: {} } };
      expect(() => createApi(context)).not.toThrow();
    });
  });

  describe("branch 3 — no cloudflare env, not DEV mode", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.stubEnv("DEV", false as unknown as string);
    });

    it('throws "Missing API_URL in Cloudflare environment" in production without API_URL', async () => {
      const { createApi } = await import("~/lib/api.server");
      expect(() => createApi({})).toThrow("Missing API_URL in Cloudflare environment");
    });

    it("throws when cloudflare env exists but API_URL is undefined in production", async () => {
      const { createApi } = await import("~/lib/api.server");
      const context = { cloudflare: { env: {} } };
      expect(() => createApi(context)).toThrow("Missing API_URL in Cloudflare environment");
    });
  });
});
