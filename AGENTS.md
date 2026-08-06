# AGENTS.md

> Canonical instructions for AI coding agents. **Single source of truth.**
>
> | Tool        | How this file is loaded                              |
> | ----------- | ---------------------------------------------------- |
> | Codex       | Native (`AGENTS.md`)                                 |
> | OpenCode    | Native (`AGENTS.md`; preferred over `CLAUDE.md`)     |
> | Cursor      | Native (`AGENTS.md`) + thin `.cursor/rules/` pointer |
> | Claude Code | Via [`CLAUDE.md`](./CLAUDE.md) import (`@AGENTS.md`) |
>
> Do **not** duplicate these rules into tool-specific files. Edit this file only.
> Deep detail lives in `docs/` — load on demand (see [Deep docs](#deep-docs-load-on-demand)).

---

## Project overview

Bonne Garde is a Bun monorepo boilerplate for Cloudflare: Elysia API (Workers) + Drizzle/D1 + Better-auth + React Router v7 (SPA / SSR / static) + shadcn/ui + R2 + Resend.

| Layer                     | Choice                                                      |
| ------------------------- | ----------------------------------------------------------- |
| Runtime / Package manager | Bun + workspaces                                            |
| Language                  | TypeScript strict everywhere                                |
| API                       | Elysia (Cloudflare Workers, AOT disabled)                   |
| Auth                      | Better-auth (email/password, sessions, email verification)  |
| ORM / DB                  | Drizzle — SQLite dialect / Cloudflare D1                    |
| Storage / Email           | Cloudflare R2 / Resend + React-Email                        |
| Shared API types          | Eden Treaty (inferred from Elysia — no manual schema)       |
| Fronts                    | React Router v7 + shadcn/ui + Tailwind + Zustand — CF Pages |
| Shared UI / Emails        | `packages/ui` / `packages/emails`                           |

### Key decisions

| Decision                      | Why                                                            |
| ----------------------------- | -------------------------------------------------------------- |
| D1 (SQLite)                   | Free, CF-integrated, portable SQLite                           |
| Eden Treaty                   | No shared package to maintain                                  |
| `new Elysia({ aot: false })`  | CF Workers V8 forbids `new Function()`                         |
| Separate `tsconfig.test.json` | `@cloudflare/workers-types` vs `bun-types` clash               |
| Platform agnosticism          | Never use CF proprietary APIs outside bindings `DB` / `BUCKET` |

---

## Structure

```
bonne-garde/
├── apps/api          # Elysia — CF Worker
├── apps/spa          # React Router SPA — backoffice
├── apps/ssr          # React Router SSR — players (PWA)
├── apps/static       # React Router SPA — landing
├── packages/emails   # React-Email templates
├── packages/ui       # Global CSS + shared components
├── docs/             # Human + deep agent docs
└── scripts/          # gen-commands, init, etc.
```

---

## Setup & commands

Always `bun` / `bunx` — never `npm` / `yarn` / `pnpm` / `npx` / `node`.
If a script exists in a `package.json`, use it — never reinvent.
Full list → [`docs/COMMANDS.md`](./docs/COMMANDS.md) (`bun run gen:commands`).

```bash
bun install
bun run init                              # env, migrations, seed
bun run dev                               # all apps in parallel
bun run typecheck && bun run test         # full verification
bun run check                             # vp check (fmt + lint via Vite+)

bun run --filter @bonne-garde/api dev
bun run --filter @bonne-garde/spa dev
bun run --filter @bonne-garde/ssr dev
bun run --filter @bonne-garde/static dev

# From apps/api/
bun run db:generate
bun run db:migrate:local
bun run db:studio
bun run db:seed
bun run auth:secret
```

---

## Non-negotiables

### Do

- **Read before writing**: this file → task/spec → existing code (`git show main:<path>` when comparing legacy)
- **Strict TDD**: red → green → refactor ([`docs/TESTING.md`](./docs/TESTING.md))
- **Eden Treaty** for all front → API calls — never raw `fetch`
- **shadcn via CLI**: `bunx shadcn@latest add <component>` — never copy by hand
- **One task = one scope** — no drive-by refactors

### Don't

- `any` — use `unknown` + type guard
- `as` to bypass an Eden type — fix the API contract at the source
- `npm` / `yarn` / `pnpm` / `npx` / `node` — `bun` / `bunx` only
- Mock Drizzle, mock `fetch`, snapshot tests
- CF proprietary APIs outside `DB` / `BUCKET`
- Skip phases defined in the spec/issue
- `--no-verify`, `reset --hard`, `push --force` without explicit request

### Clean code filter (before and after each write)

- **Algo**: simplest approach that works?
- **Archi**: right place? separation of concerns?
- **Naming**: precise and unambiguous?
- **Volume**: every line earns its place?
- **Clarity**: simple and explicit > clever and implicit

If a choice is questionable → ask **before** implementing.

---

## Verification checklist

Before considering a task done:

- [ ] `bun run typecheck` passes
- [ ] `bun run test` passes
- [ ] `bun run check` passes
- [ ] No `any`, no `as` Eden
- [ ] Eden types up to date if API changed
- [ ] New env vars → corresponding `.example` file(s)
- [ ] No files outside scope modified

---

## Deep docs (load on demand)

Do **not** preload everything. Open only what the current task needs:

| Need                                              | File                                             |
| ------------------------------------------------- | ------------------------------------------------ |
| Detailed clean-code / types / product conventions | [`docs/RULES.md`](./docs/RULES.md)               |
| Test patterns per app                             | [`docs/TESTING.md`](./docs/TESTING.md)           |
| All scripts                                       | [`docs/COMMANDS.md`](./docs/COMMANDS.md)         |
| System architecture                               | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) |
| Design system                                     | [`docs/DESIGN.md`](./docs/DESIGN.md)             |
| Environment variables                             | [`docs/ENVIRONMENT.md`](./docs/ENVIRONMENT.md)   |
| How agent files are wired across tools            | [`docs/AGENTING.md`](./docs/AGENTING.md)         |
