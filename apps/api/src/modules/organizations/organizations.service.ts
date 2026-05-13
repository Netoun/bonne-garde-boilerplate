import { Elysia } from "elysia";
import { organization, member, user } from "@bonne-garde/api/modules/db/schemas/db.auth-schema";
import { eq, and, or, isNull } from "drizzle-orm";
import { dbService } from "@bonne-garde/api/modules/db/db.service";

export const OrganizationService = new Elysia({ name: "organizations.service" })
  .use(dbService)
  .derive({ as: "scoped" }, ({ db }) => {
    const getUserOrganizations = async (userId: string) => {
      const memberships = await db
        .select({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
          role: member.role,
          settings: organization.settings,
        })
        .from(member)
        .leftJoin(organization, eq(member.organizationId, organization.id))
        .where(and(eq(member.userId, userId), isNull(organization.deletedAt)));

      return memberships
        .filter((m) => m.id !== null)
        .map((m) => ({
          id: m.id!,
          name: m.name!,
          slug: m.slug!,
          logo: m.logo,
          role: m.role,
          settings: m.settings ?? {},
        }));
    };

    const getCurrentOrganization = async (activeOrganizationId: string | null) => {
      if (!activeOrganizationId) return [];
      return [{ id: activeOrganizationId }];
    };

    const getOrganizationBySlug = async (slug: string) => {
      const org = await db
        .select({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
          settings: organization.settings,
        })
        .from(organization)
        .where(and(eq(organization.slug, slug), isNull(organization.deletedAt)))
        .limit(1);

      if (org.length === 0) return null;
      const orgRow = org[0];

      return {
        id: orgRow.id,
        name: orgRow.name,
        slug: orgRow.slug,
        logo: orgRow.logo,
        settings: orgRow.settings ?? {},
      };
    };

    const getOrgIdBySlug = async (slug: string): Promise<string | null> => {
      const org = await db
        .select({ id: organization.id })
        .from(organization)
        .where(and(eq(organization.slug, slug), isNull(organization.deletedAt)))
        .limit(1);
      return org[0]?.id ?? null;
    };

    const getOrganizationMembers = async (slug: string) => {
      const orgId = await getOrgIdBySlug(slug);
      if (!orgId) throw new Error("Organization not found");

      const members = await db
        .select({
          userId: member.userId,
          role: member.role,
          createdAt: member.createdAt,
          userName: user.name,
          userEmail: user.email,
          userImage: user.image,
        })
        .from(member)
        .leftJoin(user, eq(member.userId, user.id))
        .where(eq(member.organizationId, orgId));

      return members.map((m) => ({
        userId: m.userId,
        role: m.role,
        createdAt: m.createdAt,
        name: m.userName,
        email: m.userEmail,
        image: m.userImage,
      }));
    };

    const createOrganization = async (
      userId: string,
      input: { name: string; slug: string; description?: string },
    ) => {
      const newOrgId = crypto.randomUUID();

      await db.insert(organization).values({
        id: newOrgId,
        name: input.name,
        slug: input.slug,
        createdAt: new Date(),
        settings: input.description ? { description: input.description } : {},
      });

      await db.insert(member).values({
        id: crypto.randomUUID(),
        organizationId: newOrgId,
        userId,
        role: "owner",
        createdAt: new Date(),
      });

      return { id: newOrgId, name: input.name, slug: input.slug };
    };

    const updateOrganization = async (
      slug: string,
      input: {
        name?: string;
        slug?: string;
        logo?: string | null;
        description?: string;
        primaryColor?: string;
        secondaryColor?: string;
      },
    ) => {
      const orgId = await getOrgIdBySlug(slug);
      if (!orgId) return { success: false, error: "Organization not found" };

      const currentOrg = await db
        .select({ settings: organization.settings })
        .from(organization)
        .where(eq(organization.id, orgId))
        .limit(1);

      const currentSettings = currentOrg[0]?.settings || {};
      const newSettings = {
        ...currentSettings,
        ...(input.description !== undefined && { description: input.description }),
        ...(input.primaryColor !== undefined && { primaryColor: input.primaryColor }),
        ...(input.secondaryColor !== undefined && { secondaryColor: input.secondaryColor }),
      };

      await db
        .update(organization)
        .set({
          name: input.name,
          slug: input.slug,
          logo: input.logo,
          settings: newSettings,
        })
        .where(eq(organization.id, orgId));
      return { success: true };
    };

    const deleteOrganization = async (slug: string, userId: string) => {
      const orgId = await getOrgIdBySlug(slug);
      if (!orgId) return { success: false, error: "Organization not found", status: 404 };

      const membership = await db
        .select()
        .from(member)
        .where(
          and(
            eq(member.organizationId, orgId),
            eq(member.userId, userId),
            eq(member.role, "owner"),
          ),
        )
        .limit(1);

      if (membership.length === 0) return { success: false, error: "Forbidden", status: 403 };
      await db
        .update(organization)
        .set({ deletedAt: new Date() })
        .where(eq(organization.id, orgId));
      return { success: true };
    };

    const addMember = async (
      slug: string,
      userId: string,
      input: { email: string; role?: string },
    ) => {
      const orgId = await getOrgIdBySlug(slug);
      if (!orgId) return { success: false, error: "Organization not found", status: 404 };

      const membership = await db
        .select()
        .from(member)
        .where(
          and(
            eq(member.organizationId, orgId),
            eq(member.userId, userId),
            or(eq(member.role, "owner"), eq(member.role, "admin")),
          ),
        )
        .limit(1);

      if (membership.length === 0) return { success: false, error: "Forbidden", status: 403 };

      const userToAdd = await db.select().from(user).where(eq(user.email, input.email)).limit(1);

      if (userToAdd.length === 0) return { success: false, error: "User not found", status: 404 };

      const newMemberId = crypto.randomUUID();
      await db.insert(member).values({
        id: newMemberId,
        organizationId: orgId,
        userId: userToAdd[0].id,
        role: input.role || "member",
        createdAt: new Date(),
      });

      return { success: true, memberId: newMemberId };
    };

    const removeMember = async (slug: string, userId: string, targetUserId: string) => {
      const orgId = await getOrgIdBySlug(slug);
      if (!orgId) return { success: false, error: "Organization not found", status: 404 };

      const membership = await db
        .select()
        .from(member)
        .where(
          and(
            eq(member.organizationId, orgId),
            eq(member.userId, userId),
            or(eq(member.role, "owner"), eq(member.role, "admin")),
          ),
        )
        .limit(1);

      if (membership.length === 0) return { success: false, error: "Forbidden", status: 403 };

      await db
        .delete(member)
        .where(and(eq(member.organizationId, orgId), eq(member.userId, targetUserId)));
      return { success: true };
    };

    return {
      organizationService: {
        getUserOrganizations,
        getCurrentOrganization,
        getOrganizationBySlug,
        getOrganizationMembers,
        createOrganization,
        updateOrganization,
        deleteOrganization,
        addMember,
        removeMember,
        getOrgIdBySlug,
      },
    };
  });
