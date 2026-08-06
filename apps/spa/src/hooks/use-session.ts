import { authClient } from "@acme/spa/lib/auth";

export function useSession() {
  const { data, isPending, error } = authClient.useSession();
  type SessionData = NonNullable<typeof data>;
  type SessionWithActiveOrg = SessionData extends infer S
    ? S extends SessionData
      ? S & {
          session: S["session"] & { activeOrganizationId?: string | null };
        }
      : never
    : never;

  const typedData = (data as SessionWithActiveOrg | null) ?? null;
  return {
    isPending,
    error,
    data: typedData,
  };
}
