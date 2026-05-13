# Commandes — Table auto-générée

> ⚠️ **Ne pas éditer à la main.** Régénéré par `bun run gen:commands` depuis `scripts/gen-commands.ts`.
> Source de vérité : les `package.json` du monorepo. Dernière génération : 2026-05-13.

**Règle globale** : uniquement `bun` / `bunx`. Jamais `npm` / `yarn` / `pnpm` / `npx`.

---

### Racine

`bonne-garde-boilerplate` · Depuis la racine

| Script | Commande |
|--------|----------|
| `build` | `bun run --parallel --filter '*' build` |
| `dev` | `bun run --parallel --filter '*' dev` |
| `fmt` | `oxfmt apps/*/src packages/*/src --write` |
| `fmt:check` | `oxfmt apps/*/src packages/*/src --check` |
| `gen:commands` | `bun scripts/gen-commands.ts` |
| `init` | `bun scripts/init.ts` |
| `lint` | `oxlint apps/*/src packages/*/src` |
| `lint:fix` | `oxlint apps/*/src packages/*/src --fix` |
| `test` | `bun run --parallel --filter '*' test` |
| `typecheck` | `bun run --parallel --filter '*' typecheck` |
| `ui` | `bun run --filter '@bonne-garde/ui' registry` |

---

### apps/api

`@bonne-garde/api` · Depuis la racine : `bun run --filter @bonne-garde/api <script>` · ou depuis `apps/api/` : `bun run <script>`

| Script | Commande |
|--------|----------|
| `auth:generate` | `bunx auth@latest generate --config ./src/modules/auth/auth.config.ts --output ./src/modules/db/schemas/db.auth-schema.ts --adapter drizzle --dialect sqlite --yes` |
| `auth:secret` | `bunx auth@latest secret` |
| `build` | `tsc --noEmit` |
| `db:generate` | `drizzle-kit generate --config ./src/modules/db/db.config.ts` |
| `db:migrate:local` | `wrangler d1 migrations apply my-app-db --local` |
| `db:migrate:remote` | `wrangler d1 migrations apply my-app-db --remote` |
| `db:reset` | `wrangler d1 execute my-app-db --local --command="DELETE FROM member; DELETE FROM invitation; DELETE FROM session; DELETE FROM account; DELETE FROM medias; DELETE FROM organization; DELETE FROM user;" && bun run db:seed` |
| `db:seed` | `bun run src/modules/db/db.seed.ts` |
| `db:seed:data` | `bun run src/modules/db/db.seed.ts` |
| `db:studio` | `drizzle-kit studio` |
| `deploy` | `wrangler deploy` |
| `dev` | `wrangler dev --port 5172` |
| `test` | `bun test` |
| `test:coverage` | `bun test run --coverage` |
| `test:watch` | `bun test --watch` |
| `typecheck` | `tsc --noEmit` |

---

### apps/spa

`@bonne-garde/spa` · Depuis la racine : `bun run --filter @bonne-garde/spa <script>` · ou depuis `apps/spa/` : `bun run <script>`

| Script | Commande |
|--------|----------|
| `build` | `react-router build` |
| `deploy` | `wrangler pages deploy dist` |
| `dev` | `react-router dev` |
| `test` | `vitest run` |
| `test:coverage` | `vitest run --coverage` |
| `test:watch` | `vitest` |
| `typecheck` | `tsc --noEmit` |

---

### apps/ssr

`@bonne-garde/ssr` · Depuis la racine : `bun run --filter @bonne-garde/ssr <script>` · ou depuis `apps/ssr/` : `bun run <script>`

| Script | Commande |
|--------|----------|
| `build` | `react-router build` |
| `deploy` | `wrangler deploy` |
| `dev` | `react-router dev` |
| `test` | `vitest run` |
| `test:coverage` | `vitest run --coverage` |
| `test:watch` | `vitest` |
| `typecheck` | `tsc --noEmit` |

---

### apps/static

`@bonne-garde/static` · Depuis la racine : `bun run --filter @bonne-garde/static <script>` · ou depuis `apps/static/` : `bun run <script>`

| Script | Commande |
|--------|----------|
| `build` | `react-router build` |
| `deploy` | `wrangler pages deploy build/client` |
| `dev` | `react-router dev` |
| `typecheck` | `tsc --noEmit` |

---

### packages/emails

`@bonne-garde/emails` · Depuis la racine : `bun run --filter @bonne-garde/emails <script>` · ou depuis `packages/emails/` : `bun run <script>`

| Script | Commande |
|--------|----------|
| `dev` | `email dev --dir src/templates --port 6543` |
| `typecheck` | `tsc --noEmit` |

---

### packages/ui

`@bonne-garde/ui` · Depuis la racine : `bun run --filter @bonne-garde/ui <script>` · ou depuis `packages/ui/` : `bun run <script>`

| Script | Commande |
|--------|----------|
| `registry` | `bunx shadcn@latest` |
| `typecheck` | `tsc --noEmit` |
