import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "~/features/auth/validation";

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------

describe("loginSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "secret" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "secret" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("email");
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("password");
  });
});

// ---------------------------------------------------------------------------
// registerSchema
// ---------------------------------------------------------------------------

describe("registerSchema", () => {
  const valid = {
    name: "Alice",
    email: "alice@example.com",
    password: "strongPass1",
    confirmPassword: "strongPass1",
  };

  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain("name");
  });

  it("rejects a name longer than 50 characters", () => {
    const result = registerSchema.safeParse({ ...valid, name: "A".repeat(51) });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain("name");
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...valid, email: "bad" });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain("email");
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain("password");
  });

  it("rejects when passwords do not match", () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: "differentPass1" });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain("confirmPassword");
  });
});

// ---------------------------------------------------------------------------
// forgotPasswordSchema
// ---------------------------------------------------------------------------

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "x@y.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "nope" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("email");
  });
});

// ---------------------------------------------------------------------------
// resetPasswordSchema
// ---------------------------------------------------------------------------

describe("resetPasswordSchema", () => {
  const valid = { password: "newPass123", confirmPassword: "newPass123" };

  it("accepts matching passwords of at least 8 characters", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = resetPasswordSchema.safeParse({ password: "short", confirmPassword: "short" });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain("password");
  });

  it("rejects when passwords do not match", () => {
    const result = resetPasswordSchema.safeParse({ ...valid, confirmPassword: "different" });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain("confirmPassword");
  });
});
