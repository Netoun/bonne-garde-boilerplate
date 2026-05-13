import { Elysia } from "elysia";
import type { DB } from "../db/db.client";

export function createDbPlugin(db: DB) {
  return new Elysia({ name: "db.plugin" }).decorate("db", db);
}
