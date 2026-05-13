# Bonne Garde API

Elysia API running on Cloudflare Workers.

## Stack

- **Framework**: Elysia
- **Database**: Drizzle + D1 (SQLite)
- **Auth**: Better-auth
- **Types**: Eden Treaty

## Getting Started

```bash
# Dev server (wrangler)
bun run dev

# Deploy to Cloudflare
bun run deploy
```

## Database

```bash
# Generate Drizzle schema
bun run db:generate

# Run migrations (local)
bun run db:migrate:local

# Run migrations (remote)
bun run db:migrate:remote

# Seed database
bun run db:seed

# Reset database
bun run db:reset
```

## Auth

```bash
# Generate auth schema
bun run auth:generate

# Create auth secret
bun run auth:secret
```

## Testing

```bash
bun test
bun run test:watch
bun run test:coverage
```

## Architecture

Single source of truth for API structure and module conventions:

- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) (see section "API — Module Pattern")
