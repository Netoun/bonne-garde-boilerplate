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

- Read the [Architecture](./docs/ARCHITECTURE.md) and [Rules](./docs/RULES.md) docs first.
- Follow the existing code style: strict TypeScript, no `any`, no `as` to bypass Eden types.
- Use `bun` / `bunx`, never `npm` / `yarn` / `pnpm` / `npx`.
- Run `bun run typecheck && bun run test && bun run lint && bun run fmt:check` before committing.

## Commit messages

Keep them concise, in English. Focus on the why, not the what.

## Questions

Open a [GitHub Discussion](https://github.com/anomalyco/bonne-garde-boilerplate/discussions) for questions or proposals.
