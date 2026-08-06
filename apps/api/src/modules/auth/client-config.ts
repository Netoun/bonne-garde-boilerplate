import type { Env } from "@acme/api/lib/env";

export function getAuthClientConfig(env: Pick<Env, "API_URL" | "BO_URL" | "PLAYER_URL">) {
  return {
    baseURL: env.API_URL,
    trustedOrigins: [env.BO_URL, env.PLAYER_URL].filter(Boolean) as string[],
  } as const;
}
