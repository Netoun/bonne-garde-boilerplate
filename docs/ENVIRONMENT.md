# Environment Variables

> Single source of truth. Any new variable must be added here **and** in the corresponding `.example` files.

---

## Overview

| App | Secrets file (dev) | Non-secret config file (dev) | Prod |
|-----|-------------------|------------------------------|------|
| `apps/api` | `apps/api/.dev.vars` | `apps/api/wrangler.jsonc` → `vars` | `wrangler secret put` + `wrangler.jsonc` |
| `apps/spa` | `apps/spa/.env` | `apps/spa/wrangler.jsonc` → `vars` | `wrangler.jsonc` (env.production.vars) |
| `apps/ssr` | `apps/ssr/.env` | `apps/ssr/wrangler.jsonc` → `vars` | `wrangler.jsonc` (env.production.vars) |

**Rule**: secrets in `.dev.vars` (API) or `.env` (fronts), never committed. The `*.example` files are.

---

## apps/api — Cloudflare Worker

### Secrets (`apps/api/.dev.vars`)

| Variable | Required | Role | Generation |
|---|---|---|---|
| `BETTER_AUTH_SECRET` | ✅ | Session signing for better-auth | `bun run auth:secret` (32+ chars) |
| `RESEND_API_KEY` | ✅ | Transactional email sending | Resend Dashboard |
**Prod**: configure via `bunx wrangler secret put <NAME> --env production` from `apps/api/`.

### Public Vars (`apps/api/wrangler.jsonc` → `vars`)

| Variable | Dev | Prod |
|---|---|---|
| `API_URL` | `http://localhost:5172` | `https://api.my-app.com` |
| `R2_PUBLIC_URL` | `http://localhost:5172/v1/media/file` | `https://api.my-app.com/v1/media/file` |
| `PLAYER_URL` | `http://localhost:5174` | `https://play.my-app.com` |
| `BO_URL` | `http://localhost:5173` | `https://app.my-app.com` |

### Cloudflare Bindings (`apps/api/wrangler.jsonc`)

| Binding | Type | Resource Name | Role |
|---|---|---|---|
| `DB` | D1 | `my-app-db` | Main SQLite database |
| `BUCKET` | R2 | `my-app-media` | Image/video storage |

**D1 Migrations**: `./src/modules/db/migrations` (via `drizzle-kit generate`).

---

## apps/spa — React Router SPA

### Vars (`apps/spa/.env`)

| Variable | Dev | Prod | Role |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:5172` | Injected at build | API URL consumed client-side |

⚠️ **`VITE_`** prefix required to be exposed to client bundle.

### Worker Pages Vars (`apps/spa/wrangler.jsonc` → `vars`)

| Variable | Dev | Prod |
|---|---|---|
| `API_URL` | `http://localhost:5172` | `https://api.my-app.com` |

---

## apps/ssr — React Router SSR

### Vars (`apps/ssr/.env`)

| Variable | Dev | Prod | Role |
|---|---|---|---|
| `API_URL` | `http://localhost:5172` | Injected at build | API URL (SSR + client) |

### Worker Pages Vars (`apps/ssr/wrangler.jsonc` → `vars`)

| Variable | Dev | Prod |
|---|---|---|
| `API_URL` | `http://localhost:5172` | `https://api.my-app.com` |

---

## Root — monorepo

The root `.env` is only for **orchestration scripts** (e.g. `bun run dev` multi-apps). It does not replace per-app `.env` files.

| Variable | Role |
|---|---|
| `VITE_API_URL` | For global front scripts |
| `API_URL` | For global server-side scripts |

---

## Adding a New Variable — Checklist

1. [ ] Add it here in the correct section
2. [ ] Add it to the corresponding `.example` file (`.env.example` or `.dev.vars.example`)
3. [ ] If prod: add it to `wrangler.jsonc` → `env.production.vars` **or** via `wrangler secret put` (comment in the JSON)
4. [ ] If secret: confirm it is **never** logged or returned in an API response
5. [ ] If front-side: `VITE_` prefix required for client exposure

---

## Secret Generation

```bash
# Better-auth secret
cd apps/api && bun run auth:secret

# Generic secret (32 chars base64)
openssl rand -base64 32

# Push secret to Cloudflare (prod)
cd apps/api && bunx wrangler secret put BETTER_AUTH_SECRET --env production
```
