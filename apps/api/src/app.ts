import "elysia";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { cors } from "@elysiajs/cors";
import { config } from "@bonne-garde/api/lib/app.config";
import { dbModule } from "@bonne-garde/api/modules/db/db.module";
import { authModule } from "@bonne-garde/api/modules/auth/auth.module";
import { organizationsModule } from "@bonne-garde/api/modules/organizations/organizations.module";
import { mediaModule } from "@bonne-garde/api/modules/media/media.module";

export const app = new Elysia({ aot: false, adapter: CloudflareAdapter })
  .use(
    cors({
      origin: ({ headers }) => {
        const origin = headers.get("origin") ?? "";
        return [config.BO_URL, config.PLAYER_URL].includes(origin);
      },
      credentials: true,
    }),
  )
  .use(dbModule)
  .use(authModule)
  .group("/v1", (app) => {
    return app.use(organizationsModule).use(mediaModule);
  })
  .get("/health", () => ({ status: "ok", timestamp: Date.now() }));

export type App = typeof app;
