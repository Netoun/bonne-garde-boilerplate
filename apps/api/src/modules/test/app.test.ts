import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { treaty } from "@elysiajs/eden";
import { createTestDb } from "./db.test";

import { organizationsModule } from "../organizations/organizations.module";

export function createTestApp() {
  const db = createTestDb();

  const app = new Elysia()
    .use(cors())
    .decorate("db", db)
    .decorate("env", {
      BETTER_AUTH_SECRET: "test-secret-32-chars-long-for-testing",
      RESEND_API_KEY: "test",
      R2_PUBLIC_URL: "http://localhost/media",
      PLAYER_URL: "http://localhost:5174",
      BO_URL: "http://localhost:5173",
    })
    .get("/health", () => ({ status: "ok", timestamp: Date.now() }))
    .use(organizationsModule);

  return { app, db, api: treaty(app) };
}

export type TestApp = ReturnType<typeof createTestApp>;
