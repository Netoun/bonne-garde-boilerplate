# My App

Monorepo Cloudflare : Bun + Elysia (Workers) + Drizzle (D1/SQLite) + Better-auth + React Router v7 (SPA + SSR + Static) + shadcn/ui.

## Stack

| Layer      | Tech                              |
| ---------- | --------------------------------- |
| Runtime    | Bun                               |
| API        | Elysia (Cloudflare Workers)       |
| Database   | Drizzle + D1 (SQLite)             |
| Auth       | Better-auth                       |
| Backoffice | React Router v7 (SPA) + shadcn/ui |
| Player     | React Router v7 (SSR)             |
| Landing    | React Router v7 (Static)          |
| Storage    | Cloudflare R2                     |
| Email      | Resend + React-Email              |

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
bun install
bun run init
bun run brand   # rejouable — identité produit + scope npm
bun run dev
```

## Default Admin

Après seed :

- Email: `admin@example.local`
- Password: `password123`

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [Commands](./docs/COMMANDS.md)
- [Design](./docs/DESIGN.md)
- [Environment](./docs/ENVIRONMENT.md)
- [Rules](./docs/RULES.md)
- [Testing](./docs/TESTING.md)
- [Agent instructions](./AGENTS.md)
