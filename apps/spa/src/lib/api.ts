import { treaty } from "@elysiajs/eden";
import type { App } from "@bonne-garde/api/app";

export function resolveApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;
  new URL(apiUrl);
  return apiUrl;
}

export const apiV1 = treaty<App>(resolveApiUrl(), {
  fetch: { credentials: "include" },
}).v1;

export type { ApiRoute, EdenResponse, EdenBody, EdenQuery } from "@bonne-garde/api/lib/eden";
