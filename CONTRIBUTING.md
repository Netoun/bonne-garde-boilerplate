# Contributing

Thanks for considering contributing to Bonne Garde.

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Setup

```bash
bun install
bun run init
bun run dev
```

## Guidelines

- Read [AGENTS.md](./AGENTS.md) (agent + contributor source of truth), then [Architecture](./docs/ARCHITECTURE.md) and [Rules](./docs/RULES.md).
- Agent tooling across Claude / Codex / OpenCode / Cursor → [docs/AGENTING.md](./docs/AGENTING.md). Edit `AGENTS.md` only; keep shims thin.
- Follow the existing code style: strict TypeScript, no `any`, no `as` to bypass Eden types.
- Use `bun` / `bunx`, never `npm` / `yarn` / `pnpm` / `npx`.
- Run `bun run typecheck && bun run test && bun run check` before committing.

## Commit messages

Keep them concise, in English. Focus on the why, not the what.

## Questions

Open a [GitHub Discussion](https://github.com/anomalyco/bonne-garde-boilerplate/discussions) for questions or proposals.
