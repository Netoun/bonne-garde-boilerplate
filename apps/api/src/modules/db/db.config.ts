import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/modules/db/schemas/**.ts",
  out: "./src/modules/db/migrations",
  dialect: "sqlite",
});
