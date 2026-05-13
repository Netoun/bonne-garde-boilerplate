import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiV1 } from "@bonne-garde/spa/lib/api";

const QUERY_KEYS = {
  organizations: ["organizations"] as const,
  organization: (slug: string) => ["organization", slug] as const,
  members: (orgId: string) => ["organization-members", orgId] as const,
};

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: string;
  settings?: {
    description?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

interface OrganizationDetail extends Organization {
  scenarios: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface OrganizationMember {
  userId: string;
  role: string;
  createdAt: number;
  name: string;
  email: string;
  image: string | null;
}

// GET /api/organizations
async function fetchOrganizations(): Promise<Organization[]> {
  const response = await apiV1.organizations.get();
  if (response.error) throw response.error;
  return (response.data as Organization[]) ?? [];
}

export function useOrganizations(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEYS.organizations,
    queryFn: fetchOrganizations,
    enabled: options?.enabled ?? true,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; slug: string; description?: string }) => {
      const response = await apiV1.organizations.post(input);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
    },
  });
}

// GET /api/organizations/:slug
async function fetchOrganization(slug: string): Promise<OrganizationDetail | null> {
  const index = apiV1.organizations as unknown as Record<
    string,
    { get: () => Promise<{ data: unknown; error: unknown }> }
  >;
  const response = await index[slug].get();
  if (response.error) throw response.error;
  return (response.data as OrganizationDetail) ?? null;
}

export function useOrganization(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.organization(slug),
    queryFn: () => fetchOrganization(slug),
    enabled: !!slug,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        slug?: string;
        logo?: string;
        description?: string;
        primaryColor?: string;
        secondaryColor?: string;
      };
    }) => {
      const index = apiV1.organizations as unknown as Record<
        string,
        { patch: (body: unknown) => Promise<{ data: unknown; error: unknown }> }
      >;
      const response = await index[id].patch(data);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
}

// GET /api/organizations/:id/members
async function fetchMembers(orgId: string): Promise<OrganizationMember[]> {
  const index = apiV1.organizations as unknown as Record<
    string,
    { members: { get: () => Promise<{ data: unknown; error: unknown }> } }
  >;
  const response = await index[orgId].members.get();
  if (response.error) throw response.error;
  return (response.data as OrganizationMember[]) ?? [];
}

export function useOrganizationMembers(orgId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.members(orgId),
    queryFn: () => fetchMembers(orgId),
    enabled: !!orgId,
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      data,
    }: {
      orgId: string;
      data: { email: string; role?: string };
    }) => {
      const index = apiV1.organizations as unknown as Record<
        string,
        { members: { post: (body: unknown) => Promise<{ data: unknown; error: unknown }> } }
      >;
      const response = await index[orgId].members.post(data);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.members(variables.orgId),
      });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, userId }: { orgId: string; userId: string }) => {
      const index = apiV1.organizations as unknown as Record<
        string,
        { members: Record<string, { delete: () => Promise<{ data: unknown; error: unknown }> }> }
      >;
      const response = await index[orgId].members[userId].delete();
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.members(variables.orgId),
      });
    },
  });
}

export type { Organization, OrganizationDetail, OrganizationMember };
