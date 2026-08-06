import { Elysia } from "elysia";
import type { DB } from "@acme/api/modules/db/db.client";
import type { Env } from "@acme/api/lib/env";

export const dbService = new Elysia({ name: "db.service" })
  .decorate("db", {} as DB)
  .decorate("env", {} as Env);
