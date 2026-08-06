import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import type { Auth } from "@acme/api/modules/auth/auth.config";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  plugins: [
    inferAdditionalFields<Auth>(),
    organizationClient({ schema: inferOrgAdditionalFields<Auth>() }),
  ],
});
