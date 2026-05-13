import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { Auth } from "@bonne-garde/api/modules/auth/auth.config";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  plugins: [inferAdditionalFields<Auth>()],
});
