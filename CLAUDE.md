# CLAUDE.md

This file is a Cursor/Claude Code project-level instruction file.
For canonical, detailed agent instructions, see [`AGENTS.md`](./AGENTS.md).

**Always read `AGENTS.md` before any action.**

Key rules from `AGENTS.md`:
- Bun only (never npm/yarn/pnpm/npx)
- TypeScript strict, no `any`, no `as` to bypass Eden types
- Drizzle SQLite + Elysia + Better-auth
- Eden Treaty for frontend API calls
- Strict TDD per [`docs/TESTING.md`](./docs/TESTING.md)
- No CF proprietary APIs outside declared bindings
- One task = one scope

See `AGENTS.md` for the full reference: stack, commands, do's/don'ts, clean code filter, and checklist.
