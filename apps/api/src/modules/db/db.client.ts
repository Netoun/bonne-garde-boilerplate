import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { authSchema } from "./schemas/db.auth-schema";

export type DB = DrizzleD1Database<typeof authSchema>;

export function createDB(db: D1Database): DB {
  return drizzle(db, { schema: authSchema, logger: false });
}
