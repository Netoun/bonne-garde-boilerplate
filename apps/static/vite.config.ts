import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, searchForWorkspaceRoot } from "vite-plus";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: { tsconfigPaths: true },
  publicDir: "public",
  server: {
    port: 5175,
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },
});
