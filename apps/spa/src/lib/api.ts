import { treaty } from "@elysiajs/eden";
import type { App } from "@bonne-garde/api/app";

// Eden Treaty client for typed API calls
// ts-ignore is used here because the import.meta.env.VITE_API_URL is a runtime value
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const apiV1 = treaty<App>(import.meta.env.VITE_API_URL, {
  fetch: { credentials: "include" },
}).v1;

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
