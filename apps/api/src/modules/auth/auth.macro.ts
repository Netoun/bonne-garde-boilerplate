import { Elysia } from "elysia";
import { eq, and, isNull } from "drizzle-orm";
import { authService } from "./auth.service";
import { dbService } from "@bonne-garde/api/modules/db/db.service";
import {
  member,
  organization,
  session as sessionTable,
} from "@bonne-garde/api/modules/db/schemas/db.auth-schema";

export const AuthMacro = new Elysia({ name: "auth.macro" })
  .use(authService)
  .use(dbService)
  .macro({
    auth: {
      async resolve({ status, request, authService: auth, db }) {
        // Try to get session from cookie
        const cookieHeader = request.headers.get("cookie");

        // Create headers object for better-auth
        const headers = new Headers();
        if (cookieHeader) {
          headers.set("cookie", cookieHeader);
        }

        const authSession = await auth.api.getSession({ headers });
        if (!authSession) {
          return status(401);
        }

        const { user, session } = authSession;

        // If no active organization is set, try to get the first one as default
        let activeOrganizationId = session.activeOrganizationId;

        if (!activeOrganizationId) {
          // Query DB for user's first organization
          const userOrg = await db
            .select({
              orgId: organization.id,
            })
            .from(member)
            .leftJoin(organization, eq(member.organizationId, organization.id))
            .where(and(eq(member.userId, user.id), isNull(organization.deletedAt)))
            .limit(1);

          if (userOrg.length > 0 && userOrg[0]?.orgId) {
            activeOrganizationId = userOrg[0].orgId;

            // Update session in DB with active organization
            await db
              .update(sessionTable)
              .set({ activeOrganizationId })
              .where(eq(sessionTable.id, session.id));
          }
        }

        // Return enriched session with activeOrganizationId
        const enrichedSession = {
          ...session,
          activeOrganizationId,
        };
        return {
          user,
          session: enrichedSession,
        };
      },
    },
  });
