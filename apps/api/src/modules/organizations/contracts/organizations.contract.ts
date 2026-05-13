import { t } from "elysia";

// Body validations
export const createOrganizationBody = t.Object({
  name: t.String(),
  slug: t.String(),
  description: t.Optional(t.String()),
});

export const updateOrganizationBody = t.Object({
  name: t.Optional(t.String()),
  slug: t.Optional(t.String()),
  logo: t.Optional(t.String()),
  description: t.Optional(t.String()),
  primaryColor: t.Optional(t.String()),
  secondaryColor: t.Optional(t.String()),
});

export const addMemberBody = t.Object({
  email: t.String(),
  role: t.Optional(t.String()),
});

// Params validations
export const slugParams = t.Object({ slug: t.String() });
export const memberParams = t.Object({ slug: t.String(), userId: t.String() });

// Response schemas
export const organizationListItem = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
  logo: t.Union([t.String(), t.Null()]),
  role: t.String(),
  settings: t.Record(t.String(), t.Unknown()),
});

export const organizationListResponse = t.Array(organizationListItem);

export const organizationDetailResponse = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
  logo: t.Union([t.String(), t.Null()]),
  settings: t.Record(t.String(), t.Unknown()),
});

export const organizationDetailWithError = t.Union([
  organizationDetailResponse,
  t.Object({
    error: t.String(),
  }),
]);

export const createOrganizationResponse = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
});

export const memberListItem = t.Object({
  userId: t.String(),
  role: t.String(),
  createdAt: t.Date(),
  name: t.Union([t.String(), t.Null()]),
  email: t.Union([t.String(), t.Null()]),
  image: t.Union([t.String(), t.Null()]),
});

export const memberListResponse = t.Array(memberListItem);

export const successResponse = t.Object({
  success: t.Boolean(),
});

export const successWithErrorResponse = t.Object({
  success: t.Boolean(),
  error: t.Optional(t.String()),
});

export const addMemberResponse = t.Object({
  success: t.Boolean(),
  memberId: t.Optional(t.String()),
  error: t.Optional(t.String()),
});

// Types
export type CreateOrganizationBody = typeof createOrganizationBody.static;
export type UpdateOrganizationBody = typeof updateOrganizationBody.static;
export type AddMemberBody = typeof addMemberBody.static;
export type OrganizationParams = typeof slugParams.static;
export type SlugParams = typeof slugParams.static;
export type MemberParams = typeof memberParams.static;
export type OrganizationListItem = typeof organizationListItem.static;
export type OrganizationListResponse = typeof organizationListResponse.static;
export type OrganizationDetailResponse = typeof organizationDetailResponse.static;
export type OrganizationDetailWithError = typeof organizationDetailWithError.static;
export type CreateOrganizationResponse = typeof createOrganizationResponse.static;
export type MemberListItem = typeof memberListItem.static;
export type MemberListResponse = typeof memberListResponse.static;
export type SuccessResponse = typeof successResponse.static;
export type SuccessWithErrorResponse = typeof successWithErrorResponse.static;
export type AddMemberResponse = typeof addMemberResponse.static;
