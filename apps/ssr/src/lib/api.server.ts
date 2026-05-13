import { treaty } from "@elysiajs/eden";
import type { App } from "@bonne-garde/api/app";
import type { AppLoadContext } from "react-router";

// --- Cloudflare context extension ---
interface CloudflareContext extends AppLoadContext {
  cloudflare?: {
    env: { API_URL: string };
  };
}

/** Unwrap a callable API segment (parameterized route) or return as-is (static route). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiRoute<T> = T extends (...args: any[]) => infer R ? R : T;

/** Response data of an Eden endpoint method. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EdenResponse<T extends (...args: any[]) => Promise<any>> = NonNullable<
  Awaited<ReturnType<T>>["data"]
>;

/** Request body of an Eden endpoint method (excludes `query` and `headers`). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EdenBody<T extends (...args: any[]) => Promise<any>> =
  NonNullable<Parameters<T>[0]> extends object
    ? Omit<NonNullable<Parameters<T>[0]>, "query" | "headers">
    : never;

/** Query params of an Eden endpoint method. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EdenQuery<T extends (...args: any[]) => Promise<any>> = Parameters<T>[0] extends object
  ? Parameters<T>[0]["query"] extends object
    ? Parameters<T>[0]["query"]
    : never
  : never;

/**
 * SSR-only Eden Treaty client factory.
 * Forwards request cookies for authenticated routes.
 *
 * Usage in loaders/actions:
 *   const api = createApi(context, request);
 *   const { data: game } = await api.games({ slug: "my-game" }).get();
 */
export function createApi(context: CloudflareContext, request?: Request) {
  const apiUrl = context.cloudflare?.env.API_URL ?? "http://localhost:5172";

  const cookieHeader = request?.headers.get("cookie") ?? "";
  // @ts-ignore
  return treaty<App>(apiUrl, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    fetch: {
      credentials: "include",
    },
  }).v1;
}

export type ApiClient = ReturnType<typeof createApi>;
