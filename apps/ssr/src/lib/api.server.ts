import { treaty } from "@elysiajs/eden";
import type { App } from "@bonne-garde/api/app";
import type { AppLoadContext } from "react-router";

// --- Cloudflare context extension ---
interface CloudflareContext extends AppLoadContext {
  cloudflare?: {
    env: { API_URL?: string };
  };
}

/** Unwrap a callable API segment (parameterized route) or return as-is (static route). */
type RouteFn = (...args: unknown[]) => unknown;
type FirstArg<T extends RouteFn> = Parameters<T>[0];

export type ApiRoute<T> = T extends RouteFn ? ReturnType<T> : T;

/** Response data of an Eden endpoint method. */
export type EdenResponse<T extends RouteFn> =
  Awaited<ReturnType<T>> extends { data: infer Data } ? NonNullable<Data> : never;

/** Request body of an Eden endpoint method (excludes `query` and `headers`). */
export type EdenBody<T extends RouteFn> =
  NonNullable<FirstArg<T>> extends object
    ? Omit<NonNullable<FirstArg<T>>, "query" | "headers">
    : never;

/** Query params of an Eden endpoint method. */
export type EdenQuery<T extends RouteFn> =
  FirstArg<T> extends { query: infer Query } ? (Query extends object ? Query : never) : never;

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
