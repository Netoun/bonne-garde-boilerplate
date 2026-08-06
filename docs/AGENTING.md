# Agent tooling

How AI coding agents are configured in this repo, and how to keep them in sync.

## Principle

**One canonical file: [`AGENTS.md`](../AGENTS.md).**  
Tool-specific files are thin shims. Never copy stack, commands, or do/don't lists into multiple places.

```
AGENTS.md                 ← edit here only (Codex / OpenCode / Cursor native)
├── CLAUDE.md             ← Claude Code: @AGENTS.md import
└── .cursor/rules/agents.mdc  ← Cursor: alwaysApply pointer
```

Deep detail stays in `docs/` (`RULES.md`, `TESTING.md`, …). Agents must load those **on demand**, not at session start.

## Tool matrix

| Tool                                                          | Entry                                    | Notes                                                                 |
| ------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| [OpenAI Codex](https://agents.md/)                            | `AGENTS.md`                              | Native standard                                                       |
| [OpenCode](https://opencode.ai/docs/rules/)                   | `AGENTS.md`                              | If both exist, `AGENTS.md` wins over `CLAUDE.md`                      |
| [Cursor](https://cursor.com/)                                 | `AGENTS.md` + `.cursor/rules/agents.mdc` | Rule file only points at `AGENTS.md`                                  |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | `CLAUDE.md`                              | Must start with `@AGENTS.md` (Claude does not read `AGENTS.md` alone) |

Optional OpenCode config: [`opencode.json`](../opencode.json). Prefer lazy links from `AGENTS.md` over an always-on `instructions` array (those files are injected every session and inflate context).

## Maintenance rules

1. Change agent behavior → edit **`AGENTS.md`** only.
2. Add a Claude-only quirk → put it **below** `@AGENTS.md` in `CLAUDE.md`.
3. Add a Cursor file-scoped quirk → new `.cursor/rules/*.mdc` with `globs`, **without** duplicating `AGENTS.md`.
4. After changing commands/scripts → run `bun run gen:commands` (and architecture gen if needed).
5. Do **not** symlink `CLAUDE.md` → `AGENTS.md` on this repo: Claude needs `@` import; OpenCode already prefers `AGENTS.md`.

## Related docs

| Audience                   | File                                    |
| -------------------------- | --------------------------------------- |
| Agents (canonical)         | [`AGENTS.md`](../AGENTS.md)             |
| Humans (contribute)        | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |
| Detailed engineering rules | [`RULES.md`](./RULES.md)                |
| Tests                      | [`TESTING.md`](./TESTING.md)            |
