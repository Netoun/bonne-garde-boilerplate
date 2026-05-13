# AI.md — Agent Context Reference

This file is a derivative of the canonical agent instructions in [`AGENTS.md`](../AGENTS.md).
For the full, authoritative reference, read `AGENTS.md` before any action.

## Quick Reference

| Need | File |
|------|------|
| Full agent instructions | [`AGENTS.md`](../AGENTS.md) |
| Detailed rules (clean code, TDD, types) | [`RULES.md`](./RULES.md) |
| Test patterns | [`TESTING.md`](./TESTING.md) |
| Environment variables | [`ENVIRONMENT.md`](./ENVIRONMENT.md) |
| System architecture | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Design system | [`DESIGN.md`](./DESIGN.md) |

**Stack**: Bun + TypeScript strict + Elysia (AOT disabled) + Drizzle SQLite + Better-auth + Cloudflare D1/R2 + Resend + React-Email + React Router v7 (SPA BO + SSR Player) + shadcn/ui + Tailwind + Zustand.

**Golden rules**: Bun/bunx only, no `any`, Eden Treaty for API calls, no CF proprietary outside bindings, strict scope per task.
