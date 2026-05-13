# Bonne Garde — Context & Rules for AI Agents

> Entry point for all AI agents (Claude, Codex, Cursor...). Read before any action.

---

## Stack

| Layer | Choice |
|-------|--------|
| Runtime / Package manager | Bun + workspaces |
| Language | TypeScript strict everywhere |
| API | Elysia (Cloudflare Workers, AOT disabled) |
| Auth | Better-auth (email/password, sessions, email verification) |
| ORM | Drizzle — SQLite dialect |
| DB | Cloudflare D1 (SQLite, portable to libsql/Turso) |
| Storage | Cloudflare R2 |
| Email | Resend + React-Email |
| Shared API types | Eden Treaty (inferred from Elysia, no manual schema) |
| BO | React Router v7 SPA — shadcn/ui + Tailwind + Zustand — CF Pages |
| Player | React Router v7 SSR/PWA — shadcn/ui + Tailwind + Zustand — CF Pages |
| Static | React Router v7 SPA — shadcn/ui + Tailwind + Zustand — CF Pages |
| Shared UI | `packages/ui` — global CSS + shadcn components |
| Emails | React-Email templates (`packages/emails`) |

### Architecture Decisions

| Decision | Reason |
|----------|--------|
| D1 (SQLite) | Free, CF integrated, portable SQLite |
| Eden Treaty | No shared package to maintain |
| Better-auth | Email/password + sessions + email verification out of the box |
| R2 | CF integrated, no third-party cost for egress |
| Resend + React-Email | Free tier, templates as React components |
| BO SPA | No SSR needed for backoffice |
| Player SSR | SEO + initial performance for mobile players |

### Implementation-discovered Decisions

| Decision | Context | Fix |
|----------|---------|-----|
| `new Elysia({ aot: false })` | CF Workers V8 forbids `new Function()` | Disable AOT in `createApp()` |
| Separate `tsconfig.test.json` | `@cloudflare/workers-types` and `bun-types` incompatible | `tsconfig.json` for src, `tsconfig.test.json` for tests |

### Platform Agnosticism

Never use CF proprietary APIs outside declared bindings (`DB`, `BUCKET`).
D1 → libsql/Turso, R2 → S3-compatible, Workers → Bun/Node, Pages → any host.

---

## Structure

```
bonne-garde/
├── apps/api          # Elysia — CF Worker
├── apps/spa          # React Router SPA — backoffice
├── apps/ssr          # React Router SSR — players (PWA)
├── apps/static       # React Router SPA — static/landing pages
├── packages/emails   # React-Email templates
├── packages/ui       # Global CSS + shared components
├── docs/             # All documentation
├── scripts/          # gen-commands.ts and others
```

---

## Commands — always `bun` / `bunx`, never `npm` / `yarn` / `npx`

Exhaustive list → [`COMMANDS.md`](./docs/COMMANDS.md) (regenerate: `bun run gen:commands`).

```bash
bun install                               # install the monorepo
bun run dev                               # all apps in parallel
bun run typecheck && bun run test         # full verification
bun run lint && bun run fmt:check          # oxlint + oxfmt
bun run gen:commands                      # regenerate docs/COMMANDS.md
bun run gen:architecture                  # regenerate docs/ARCHITECTURE.md

bun run --filter @bonne-garde/api dev
bun run --filter @bonne-garde/spa dev
bun run --filter @bonne-garde/ssr dev
bun run --filter @bonne-garde/static dev

# From apps/api/
bun run db:generate        # drizzle-kit generate
bun run db:migrate:local   # apply D1 migrations locally
bun run db:studio
bun run db:seed
bun run auth:secret        # generates BETTER_AUTH_SECRET
```

**Rule**: if a script exists in a `package.json`, use it — never reinvent.

---

## Do's

- **Read before writing**: this file → the issue/spec → `git show main:<path>` (legacy) → existing code
- **Strict TDD**: red → green → refactor. Details → [`TESTING.md`](./docs/TESTING.md)
- **Eden Treaty** for all front API calls — never raw fetch
- **shadcn via CLI**: `bunx shadcn@latest add <component>` — never copy by hand
- **Strict scope**: one change = one scope, do not touch elsewhere "in passing"

## Don'ts

- ❌ `any` — `unknown` + type guard
- ❌ `as` to bypass an Eden type — fix the API contract at the source
- ❌ `npm` / `yarn` / `pnpm` / `npx` — `bun` / `bunx` only
- ❌ Mock Drizzle, mock `fetch`, snapshot tests
- ❌ CF proprietary API outside `DB` / `BUCKET`
- ❌ Skip phases defined in the spec/issue
- ❌ `--no-verify`, `reset --hard`, `push --force` without explicit request

---

## Clean Code Filter — before and after each write

- **Algo**: good approach? Simplest possible?
- **Archi**: right place? Separation of concerns respected?
- **Naming**: precise, unambiguous?
- **Volume**: every line has a reason to exist? No dead code, no premature abstraction.
- **Clarity**: simple and explicit > clever and implicit.

If a choice is questionable → raise it **before** implementing.

---

## Checklist Before Rendering a Task

- [ ] `bun run typecheck` passes
- [ ] `bun run test` passes
- [ ] `bun run lint && bun run fmt:check` pass
- [ ] No `any`, no `as` Eden
- [ ] Eden types up to date if API changed
- [ ] New env vars → corresponding `.example` file(s)
- [ ] No files outside scope modified
- [ ] Issue/PR annotated with outcome

---

## Where to Find What

| Need | File |
|------|------|
| Detailed rules (clean code, TDD, types) | [`RULES.md`](./docs/RULES.md) |
| Test patterns | [`TESTING.md`](./docs/TESTING.md) |
| Environment variables | [`ENVIRONMENT.md`](./docs/ENVIRONMENT.md) |
| All scripts | [`COMMANDS.md`](./docs/COMMANDS.md) |
| System architecture | [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) |
| Design system | [`DESIGN.md`](./docs/DESIGN.md) |
| Agent instructions | this file |
