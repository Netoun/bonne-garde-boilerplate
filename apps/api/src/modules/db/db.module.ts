import { Elysia } from "elysia";
import { config } from "@acme/api/lib/app.config";
import { createDB } from "./db.client";
import { dbService } from "./db.service";

export const dbModule = new Elysia({ name: "db.module" })
  .use(dbService)
  .derive({ as: "global" }, () => ({
    db: createDB(config.DB),
    env: config,
  }));
