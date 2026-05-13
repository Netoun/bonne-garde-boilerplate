import { Elysia } from "elysia";
import type { DB } from "@bonne-garde/api/modules/db/db.client";
import type { Env } from "@bonne-garde/api/lib/env";

export const dbService = new Elysia({ name: "db.service" })
  .decorate("db", {} as DB)
  .decorate("env", {} as Env);
