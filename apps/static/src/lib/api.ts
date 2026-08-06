import { treaty } from "@elysiajs/eden";
import type { App } from "@acme/api/app";

function resolveApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;
  new URL(apiUrl);
  return apiUrl;
}

export const apiV1 = treaty<App>(resolveApiUrl(), {
  fetch: { credentials: "include" },
}).v1;

export type { ApiRoute, EdenResponse, EdenBody, EdenQuery } from "@acme/api/lib/eden";
