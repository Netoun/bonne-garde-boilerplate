import { treaty } from "@elysiajs/eden";
import type { App } from "@acme/api/app";

interface CloudflareContext {
  cloudflare?: {
    env: { API_URL?: string };
  };
}

export type { ApiRoute, EdenResponse, EdenBody, EdenQuery } from "@acme/api/lib/eden";

function resolveApiUrl(context: CloudflareContext): string {
  const apiUrl = context.cloudflare?.env.API_URL;
  if (apiUrl) {
    new URL(apiUrl);
    return apiUrl;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5172";
  }

  throw new Error("Missing API_URL in Cloudflare environment");
}

/**
 * SSR-only Eden Treaty client factory.
 * Forwards request cookies for authenticated routes.
 *
 * Usage in loaders/actions:
 *   const api = createApi(context, request);
 *   const { data: game } = await api.games({ slug: "my-game" }).get();
 */
export function createApi(context: CloudflareContext, request?: Request) {
  const apiUrl = resolveApiUrl(context);
  const cookieHeader = request?.headers.get("cookie") ?? "";
  return treaty<App>(apiUrl, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    fetch: {
      credentials: "include",
    },
  }).v1;
}

export type ApiClient = ReturnType<typeof createApi>;
