import { describe, it, expect } from "bun:test";
import { createTestAuth } from "./testing";

// Better Auth keys a rate-limit bucket on the client's address, which it reads from the headers it
// is told to. Told nothing, it reads `x-forwarded-for` alone, which Workers do not set: every client
// then falls into one bucket, and sign-in is capped at ten a minute for all of them together.
describe("the rate limit counts each client on its own", () => {
  const wrongCredentials = { email: "nobody@example.com", password: "not the password" };

  it("throttles a client past ten sign-ins a minute, and does not throttle another one", async () => {
    const { call } = await createTestAuth({ clientIpHeaders: ["cf-connecting-ip"] });
    const statuses: number[] = [];

    for (let attempt = 0; attempt < 11; attempt += 1) {
      const response = await call("/sign-in/email", { body: wrongCredentials, ip: "203.0.113.10" });
      statuses.push(response.status);
    }
    const other = await call("/sign-in/email", { body: wrongCredentials, ip: "203.0.113.11" });

    expect(statuses.slice(0, 10)).toEqual(Array.from({ length: 10 }, () => 401));
    expect(statuses[10]).toBe(429);
    expect(other.status).toBe(401);
  });

  it("reads the address from the header the provider names, and ignores one a client sets", async () => {
    const { call } = await createTestAuth({ clientIpHeaders: ["cf-connecting-ip"] });
    const statuses: number[] = [];

    // One client, a different forged `x-forwarded-for` each time: still one bucket.
    for (let attempt = 0; attempt < 11; attempt += 1) {
      const response = await call("/sign-in/email", {
        body: wrongCredentials,
        ip: "203.0.113.20",
        headers: { "x-forwarded-for": `198.51.100.${attempt + 1}` },
      });
      statuses.push(response.status);
    }

    expect(statuses[10]).toBe(429);
  });
});
