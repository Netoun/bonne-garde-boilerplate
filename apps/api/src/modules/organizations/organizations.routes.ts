import { Elysia } from "elysia";
import { AuthMacro } from "@bonne-garde/api/modules/auth/auth.macro";
import { OrganizationService } from "./organizations.service";
import {
  createOrganizationBody,
  updateOrganizationBody,
  addMemberBody,
  slugParams,
  memberParams,
  organizationListResponse,
  organizationDetailWithError,
  createOrganizationResponse,
  memberListResponse,
  successWithErrorResponse,
  addMemberResponse,
} from "./contracts/organizations.contract";

export const organizationsRoutes = new Elysia({
  name: "organizations.routes",
  prefix: "/organizations",
})
  .use(AuthMacro)
  .use(OrganizationService)
  .guard({ auth: true })
  .get(
    "/",
    async ({ user, organizationService }) => {
      return organizationService.getUserOrganizations(user.id);
    },
    { response: organizationListResponse },
  )
  .get(
    "/:slug",
    async ({ params, organizationService, set }) => {
      const org = await organizationService.getOrganizationBySlug(params.slug);
      if (!org) {
        set.status = 404;
        return { error: "Organization not found" };
      }
      return org;
    },
    { params: slugParams, response: organizationDetailWithError },
  )
  .post(
    "/",
    async ({ user, body, organizationService }) => {
      return organizationService.createOrganization(user.id, body);
    },
    { body: createOrganizationBody, response: createOrganizationResponse },
  )
  .get(
    "/:slug/members",
    async ({ params, organizationService }) => {
      return organizationService.getOrganizationMembers(params.slug);
    },
    { params: slugParams, response: memberListResponse },
  )
  .patch(
    "/:slug",
    async ({ params, body, organizationService }) => {
      return organizationService.updateOrganization(params.slug, body);
    },
    { params: slugParams, body: updateOrganizationBody, response: successWithErrorResponse },
  )
  .delete(
    "/:slug",
    async ({ params, user, organizationService, set }) => {
      const result = await organizationService.deleteOrganization(params.slug, user.id);
      if (result.status) set.status = result.status;
      return result;
    },
    { params: slugParams, response: successWithErrorResponse },
  )
  .post(
    "/:slug/members",
    async ({ params, body, user, organizationService, set }) => {
      const result = await organizationService.addMember(params.slug, user.id, body);
      if (result.status) set.status = result.status;
      return result;
    },
    { params: slugParams, body: addMemberBody, response: addMemberResponse },
  )
  .delete(
    "/:slug/members/:userId",
    async ({ params, user, organizationService, set }) => {
      const result = await organizationService.removeMember(params.slug, user.id, params.userId);
      if (result.status) set.status = result.status;
      return result;
    },
    { params: memberParams, response: successWithErrorResponse },
  );
