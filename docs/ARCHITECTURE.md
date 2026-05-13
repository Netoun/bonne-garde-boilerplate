# Architecture

## Overview

Bonne Garde is a Bun monorepo with three apps and a shared package, deployed entirely on Cloudflare. The stack is decoupled from CF: D1 → libsql/Turso, R2 → S3-compatible, Workers → Bun/Node.

```
┌──────────────────────────────────────────────────────────────────┐
│                          Cloudflare                              │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    apps/spa      │  │  apps/ssr    │  │    apps/api     │  │
│  │─────────────────│  │─────────────────│  │─────────────────│  │
│  │ React Router v7 │  │ React Router v7 │  │     Elysia      │  │
│  │ SPA (no SSR)    │  │ SSR + PWA       │  │  CF Workers     │  │
│  │ Zustand         │  │ loaders/actions │  │  Better-auth    │  │
│  │ shadcn/ui       │  │ shadcn/ui       │  │  Drizzle ORM    │  │
│  │ CF Pages        │  │ CF Pages        │  ├────────┬────────┤  │
│  └────────┬────────┘  └────────┬────────┘  │   D1   │   R2  │  │
│           │                   │            │ SQLite │Storage│  │
│           └───────────────────┴────────────┘        │       │  │
│                      Eden Treaty (type-safe HTTP)            │  │
└──────────────────────────────────────────────────────────────┘
```

| Block | Role |
|------|------|
| **Elysia** | Type-safe HTTP framework for CF Workers (AOT disabled for V8) |
| **Better-auth** | Email/password auth + sessions + email verification, out-of-the-box |
| **Drizzle** | Type-safe ORM, SQLite dialect, generates SQL migrations |
| **D1** | Managed CF SQLite database, accessible via `DB` binding in the Worker |
| **R2** | CF object storage, accessible via `BUCKET` binding |
| **Eden Treaty** | Type-safe HTTP client inferred from Elysia types — no shared schema |
| **React Router v7** | File-based routing; SPA (bo) or SSR with loaders/actions (player) |
| **packages/ui** | Global Tailwind CSS + shared shadcn components between bo and player |

## Communication

Both front apps communicate with the API via **Eden Treaty**, a type-safe HTTP client inferred directly from Elysia types:

```typescript
// lib/api.ts
export const api = treaty<App>('https://api.bonne-garde.com')
const { data } = await api.scenarios({ slug }).get()
```

Behavior differs depending on the rendering mode:

- **bo (SPA)**: Eden calls from the browser, session via HTTP-only cookie
- **player (SSR)**: Eden calls in React Router loaders server-side, cookie forwarded from the request

Auth is handled by Better-auth. Sessions are in HTTP-only cookies in both cases, but player reads them server-side before rendering the page.

## API — Module Pattern

The API follows a layered module convention where each file has a single responsibility:

```
contract(s)  →  service  →  routes  →  module  →  app.ts
(schemas)       (logic)     (HTTP)     (compose)
```

### Naming convention (Elysia plugin names)

- `*.module` for module composition plugins
- `*.routes` for HTTP route plugins
- `*.service` for business logic plugins (`derive`)
- `*.macro` / `*.guard` for auth and access-control layers

### Canonical feature layout

```
modules/<feature>/
├── <feature>.module.ts
├── <feature>.routes.ts
├── <feature>.service.ts          # optional if routes are thin-only
└── contracts/
    └── <feature>.contract.ts
```

### Domain-oriented submodules (example: `play`)

When a feature has multiple bounded subdomains, each subfolder keeps the same pattern:

```
modules/play/
├── play.module.ts
├── play.routes.ts                # composition only
├── auth/
│   ├── play-auth.macro.ts
│   └── play-auth.service.ts
├── scan/
│   ├── play-scan.contract.ts
│   ├── play-scan.routes.ts
│   ├── play-scan-token.service.ts
│   └── play-scan.e2e.test.ts
├── session/
│   ├── play-session.contract.ts
│   ├── play-session.routes.ts
│   └── play-session.e2e.test.ts
├── solo/
│   ├── play-solo.contract.ts
│   ├── play-solo.routes.ts
│   └── play-solo.service.ts
└── team/
    ├── play-team.contract.ts
    ├── play-team.routes.ts
    └── play-team.service.ts
```

### Condensed example: `scenarios`

```typescript
// service — business logic injected into Elysia context
export const ScenarioService = new Elysia({ name: "scenarios.service" })
  .use(dbService)
  .derive({ as: "scoped" }, ({ db }) => ({
    getAll: () => db.select().from(scenarios),
    getBySlug: (slug: string) => db.select().from(scenarios).where(eq(scenarios.slug, slug)),
  }));

// routes — HTTP, guarded auth
export const scenariosRoutes = new Elysia({ name: "scenarios.routes", prefix: "/scenarios" })
  .use(AuthMacro)
  .use(ScenarioService)
  .guard({ auth: true })
  .get("/", ({ scenarioService }) => scenarioService.getAll())
  .get("/:slug", ({ params, scenarioService }) => scenarioService.getBySlug(params.slug));

// module — wired into app.ts
export const scenariosModule = new Elysia({ name: "scenarios.module" }).use(scenariosRoutes);
```

Types from all modules bubble up into `App` and are exposed via Eden Treaty.

## Deployment

| App | Platform | Mode |
|-----|----------|------|
| api | CF Workers | Elysia + D1 (SQLite) + R2 |
| bo | CF Pages | Static SPA |
| player | CF Pages | SSR (CF adapter) |
