import { describe, it, expect, beforeEach } from "bun:test";
import { Elysia } from "elysia";
import { treaty } from "@elysiajs/eden";
import { createTestDb, type TestDb } from "../test/db.test";
import { organization, member, user, session } from "../db/schemas/db.auth-schema";
import { OrganizationService } from "./organizations.service";

describe("Organizations API (E2E)", () => {
  let db: TestDb;
  let api: ReturnType<typeof treaty>;

  beforeEach(async () => {
    db = createTestDb();

    const now = Date.now();

    await db.insert(user).values({
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    });

    await db.insert(session).values({
      id: "session-1",
      token: "test-token",
      userId: "user-1",
      expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now),
      updatedAt: new Date(now),
    });

    const app = new Elysia()
      .decorate("db", db)
      .use(OrganizationService)
      .get(
        "/v1/organizations",
        async ({
          organizationService,
        }: {
          organizationService: { getUserOrganizations: (userId: string) => Promise<unknown[]> };
        }) => organizationService.getUserOrganizations("user-1"),
      )
      .get(
        "/v1/organizations/:slug",
        async ({
          params,
          organizationService,
          set,
        }: {
          params: { slug: string };
          organizationService: { getOrganizationBySlug: (slug: string) => Promise<unknown> };
          set: { status: number };
        }) => {
          const org = await organizationService.getOrganizationBySlug(params.slug);
          if (!org) {
            set.status = 404;
            return { error: "Organization not found" };
          }
          return org;
        },
      )
      .post(
        "/v1/organizations",
        async ({
          organizationService,
        }: {
          organizationService: {
            createOrganization: (
              userId: string,
              input: { name: string; slug: string },
            ) => Promise<unknown>;
          };
        }) =>
          organizationService.createOrganization("user-1", { name: "Test Org", slug: "test-org" }),
      )
      .patch(
        "/v1/organizations/:id",
        async ({
          params,
          body,
          organizationService,
        }: {
          params: { id: string };
          body: Record<string, unknown>;
          organizationService: {
            updateOrganization: (id: string, input: Record<string, unknown>) => Promise<unknown>;
          };
        }) => organizationService.updateOrganization(params.id, body),
      )
      .delete(
        "/v1/organizations/:id",
        async ({
          params,
          organizationService,
        }: {
          params: { id: string };
          organizationService: {
            deleteOrganization: (id: string, userId: string) => Promise<unknown>;
          };
        }) => organizationService.deleteOrganization(params.id, "user-1"),
      );

    api = treaty(app).v1;
  });

  describe("GET /api/organizations", () => {
    it("returns empty list for new user", async () => {
      const { data, error } = await api.organizations.get();

      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it("returns user's organizations", async () => {
      const now = Date.now();
      await db.insert(organization).values({
        id: "org-1",
        name: "Test Org",
        slug: "test-org",
        createdAt: new Date(now),
      });

      await db.insert(member).values({
        id: "member-1",
        organizationId: "org-1",
        userId: "user-1",
        role: "owner",
        createdAt: new Date(now),
      });

      const { data, error } = await api.organizations.get();

      expect(error).toBeNull();
      expect(data?.length).toBe(1);
      expect(data?.[0].name).toBe("Test Org");
    });
  });

  describe("POST /api/organizations", () => {
    it("creates organization", async () => {
      const { data, error } = await api.organizations.post();

      expect(error).toBeNull();
      expect(data?.id).toBeDefined();
      expect(data?.name).toBe("Test Org");
      expect(data?.slug).toBe("test-org");
    });
  });

  describe("GET /api/organizations/:slug", () => {
    it("returns organization by slug", async () => {
      const now = Date.now();
      await db.insert(organization).values({
        id: "org-1",
        name: "Test Org",
        slug: "test-org",
        createdAt: new Date(now),
      });

      const { data, error } = await api.organizations["test-org"].get();

      expect(error).toBeNull();
      expect(data?.name).toBe("Test Org");
    });

    it("returns 404 for non-existent slug", async () => {
      const { data, error } = await api.organizations["non-existent"].get();
      expect(data).toBeFalsy();
      expect(error?.status).toBe(404);
    });
  });
});
