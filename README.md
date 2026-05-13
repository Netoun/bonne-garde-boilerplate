# Bonne Garde Boilerplate

Full-stack monorepo boilerplate **for Cloudflare**: Bun + Elysia (Workers) + Drizzle (D1/SQLite) + Better-auth + React Router v7 (SPA + SSR + Static) + shadcn/ui.

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Bun |
| API | Elysia (Cloudflare Workers) |
| Database | Drizzle + D1 (SQLite) |
| Auth | Better-auth (email/password, sessions, verification) |
| Backoffice | React Router v7 (SPA) + shadcn/ui |
| Player | React Router v7 (SSR) + shadcn/ui |
| Landing | React Router v7 (Static) + shadcn/ui |
| Storage | Cloudflare R2 |
| Email | Resend + React-Email |

## Structure

```
bonne-garde/
├── apps/
│   ├── api/         # Elysia API (Cloudflare Workers)
│   ├── spa/         # Backoffice (React Router SPA)
│   ├── ssr/         # Player app (React Router SSR)
│   └── static/      # Marketing/Landing (React Router Static)
├── packages/
│   └── ui/          # Shared UI components + shadcn
└── docs/            # Architecture & rules
```

## Getting StartedTreasHunt

```bash
# 1. Install
bun install

# 2. Initialize the project (env, migrations, seed)
bun run init

# 3. Start dev servers (all apps in parallel)
bun run dev
# API:     http://localhost:5172
# SPA:     http://localhost:5173
# SSR:     http://localhost:5174
# Static:  http://localhost:5175
```

## Default Admin

After seeding:
- Email: `admin@bonne-garde.local`
- Password: `password123`

## Commands

```bash
bun run lint        # oxlint
bun run fmt         # oxfmt
bun run typecheck   # tsc across all packages
bun run test        # all tests
```

## Environment Variables

See [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) for all env vars per app.

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [Rules](./docs/RULES.md)
- [Testing](./docs/TESTING.md)
- [Agent instructions](./AGENTS.md)
