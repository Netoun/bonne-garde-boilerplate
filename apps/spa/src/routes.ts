import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("features/dashboard/pages/index-redirect.tsx"),

  // Auth routes with layout
  route("auth", "features/auth/pages/auth-layout.tsx", [
    route("login", "features/auth/pages/auth-login.tsx"),
    route("register", "features/auth/pages/auth-register.tsx"),
    route("forgot-password", "features/auth/pages/auth-forgot-password.tsx"),
    route("reset-password", "features/auth/pages/auth-reset-password.tsx"),
    route("verify-email", "features/auth/pages/auth-verify-email.tsx"),
  ]),

  layout("features/layout/pages/app-layout.tsx", [
    route("dashboard", "features/dashboard/pages/dashboard.tsx"),
    route("organizations", "features/organization/pages/organization-page.tsx"),
    route("organizations/new", "features/organization/pages/organization-new-page.tsx"),
    route(
      "organizations/:organizationSlug/settings",
      "features/organization/pages/organization-settings-page.tsx",
    ),
    route(
      "organizations/:organizationSlug/members",
      "features/organization/pages/organization-members-page.tsx",
    ),
  ]),
] satisfies RouteConfig;
