# Environment Variables

Source of truth: `apps/*/.env.example` and `apps/api/.dev.vars.example`. This file documents conventions only, not variable values.

## Conventions

| Rule | |
|------|---|
| Secrets | `.dev.vars` (API) / `.env` (fronts) — **never committed** |
| Public vars | `wrangler.jsonc` → `vars` (dev) / `env.production.vars` (prod) |
| Client-exposed | `VITE_` prefix mandatory for SPA |
| Prod secrets | `wrangler secret put <NAME>` from the app directory |

## Secret generation

```bash
cd apps/api && bun run auth:secret     # BETTER_AUTH_SECRET
openssl rand -base64 32                # generic
```
