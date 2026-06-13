import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [resolve(__dirname, "./tests/setup.ts")],
    globals: true,
    // Valid default so importing src/lib/api.ts (which calls resolveApiUrl at
    // module load) never throws; individual tests override via vi.stubEnv.
    env: { VITE_API_URL: "http://localhost:5172" },
    include: ["src/**/*.test.tsx", "src/**/*.test.ts", "tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
