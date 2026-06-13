import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveApiUrl } from "~/lib/api";

/**
 * resolveApiUrl() reads import.meta.env.VITE_API_URL at call time and validates
 * it with `new URL(...)`. We call it directly (synchronously) and override the
 * env per-test with vi.stubEnv — no dynamic import / module-load side effects.
 */
describe("resolveApiUrl (apps/spa/src/lib/api.ts)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the URL when VITE_API_URL is a valid URL", () => {
    vi.stubEnv("VITE_API_URL", "http://api.example.com");
    expect(resolveApiUrl()).toBe("http://api.example.com");
  });

  it("throws when VITE_API_URL is not a valid URL", () => {
    vi.stubEnv("VITE_API_URL", "not-a-valid-url");
    expect(() => resolveApiUrl()).toThrow();
  });

  it("throws when VITE_API_URL is undefined", () => {
    vi.stubEnv("VITE_API_URL", undefined as unknown as string);
    expect(() => resolveApiUrl()).toThrow();
  });
});
