# My App

Monorepo Cloudflare : Bun + Elysia (Workers) + Drizzle (D1/SQLite) + Better-auth + React Router v8 (SPA + SSR + Static) + shadcn/ui. Toolchain: **Vite+** (Vite, Vitest, Oxlint, Oxfmt).

## Stack

| Layer    | Tech                                                |
| -------- | --------------------------------------------------- |
| Runtime  | Bun                                                 |
| API      | Elysia (Cloudflare Workers)                         |
| Database | Drizzle + D1 (SQLite)                               |
| Auth     | Better-auth                                         |
| SPA      | React Router v8 + shadcn/ui — Cloudflare Pages      |
| SSR      | React Router v8 — Cloudflare Workers                |
| Static   | React Router v8 (SPA by default) — Cloudflare Pages |
| Storage  | Cloudflare R2                                       |
| Email    | Resend + React-Email                                |

## Structure

```
acme/
├── apps/
│   ├── api/
│   ├── spa/
│   ├── ssr/
│   └── static/
├── packages/
│   ├── config/
│   ├── ui/
│   └── emails/
└── docs/
```

## Getting Started

```bash
bun install --frozen-lockfile
bun run init
bun run brand   # rejouable — identité produit + scope npm
bun run dev
```

Use the Bun version declared in `package.json#packageManager`. The init wizard keeps workspace dependencies automatically; preview removals with `bun run init -- --dry-run`.

## Verification

`bun run verify` runs formatting/lint checks, typechecking (including scripts and API tests), all tests, and all builds.

`bun run test` includes script tests, real SQLite API tests, package tests, and frontend tests through Vite+ (Vitest + RTL + MSW).

## Default Admin — local development only

Après seed :

- Email: `admin@example.local`
- Password: `password123`

Never seed these demo credentials in production. Configure Cloudflare resources and secrets before enabling deployment; see [Environment](./docs/ENVIRONMENT.md).

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [Commands](./docs/COMMANDS.md)
- [Design](./docs/DESIGN.md)
- [Environment](./docs/ENVIRONMENT.md)
- [Rules](./docs/RULES.md)
- [Testing](./docs/TESTING.md)
- [Agent instructions](./AGENTS.md)
