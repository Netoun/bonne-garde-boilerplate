# auth/better-auth

Session authentication over the project's database: email and password, email verification, password
reset, and organizations. It is the legacy `apps/api/src/modules/auth` extracted into its own package,
`packages/auth`, which `apps/api` mounts.

```bash
bunx bg add provider/cloudflare config/branding api/elysia db/d1 orm/drizzle auth/better-auth
```

## Peers and variant

| Peer       | Allow-list | Why                                                                                            |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `provider` | any        | `readRuntimeEnv` from `{{SCOPE}}/api-runtime` reads the secret; the provider owns that package |
| `api`      | any        | the CORS allow-list, the logger and the config of `{{SCOPE}}/api/lib/*`                        |
| `db`       | `d1`       | `readD1()` from `{{SCOPE}}/db/d1`                                                              |
| `orm`      | `drizzle`  | `createDB` from `{{SCOPE}}/db` and the test database from `{{SCOPE}}/db/testing`               |

One variant, `default`. It is Cloudflare-only today, through `db/d1`: a project on the `dockerfile`
provider has no `db` module, so it cannot install auth until one exists.

`bg add better-auth` in a project with no `orm` fails with
`auth/better-auth needs a module in category orm (drizzle) and none is installed`, before anything is
written. Golden checks that with the packed CLI, and the contract test checks the planner.

**It has no `withOrg` option.** 035's example declares one. A variant selects files by the installed
peers only (`match` takes categories), and `--set` is refused, so an option would resolve to its
default, be recorded, and change nothing. The schema is generator output with the organization,
member and invitation tables in it, and `storage`'s `medias` table has foreign keys onto
`organization`. The module ships organizations always.

## What it writes

Everything in `packages/auth`, from explicit paths:

| File                 | What it is                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `package.json`       | `{{SCOPE}}/auth`: the `.`, `./client`, `./schema` and `./testing` exports, the scripts below          |
| `src/auth.config.ts` | `createAuth(options)`: the Better Auth instance, with no environment read and nothing built at import |
| `src/auth.module.ts` | `authModule` (the handler mounted on the app) and `authMacro` (`{ auth: true }` on a route)           |
| `src/schema.ts`      | the Drizzle tables and relations, **generator output** (see below)                                    |
| `src/env.ts`         | `resolveAuthEnv`: `BETTER_AUTH_SECRET`, read from `readRuntimeEnv()`                                  |
| `src/mailer.ts`      | `AuthMailer`, and the `mailer` an `email` module replaces                                             |
| `src/password.ts`    | scrypt `hashPassword` / `verifyPassword`, shared with the seed                                        |
| `src/client.ts`      | what a front imports: `type Auth` and `AUTH_BASE_PATH`                                                |
| `src/auth.cli.ts`    | the entry `auth:generate` loads                                                                       |
| `src/testing.ts`     | `createTestAuth()`: an instance over real in-memory SQLite, for this package's tests and others'      |
| `src/*.test.ts`      | the tests that travel, and the new ones, all against real SQLite: no mock of Drizzle or `fetch`       |

Dependencies are exact: `better-auth` and `@better-auth/drizzle-adapter` at the same release (a
contract test pins that, and the CLI the scripts run), `drizzle-orm`, `elysia`, and the project's
`api`, `api-runtime` and `db` as workspaces. `api` imports `auth` to mount it and `auth` imports `api`'s
`lib/*`; `db`'s barrel will re-export `auth`'s tables. Bun accepts those workspace cycles.

## The schema is pure generator output

`bun run auth:generate` (in `packages/auth`) runs the Better Auth CLI, pinned to the version the package
depends on, on `src/auth.cli.ts`, writes `src/schema.ts`, and formats it. It runs on node through the
CLI's shebang, on purpose: under `bunx --bun` the generator drops every `created_at` default without an
error (it tests `defaultValue.toString()` for `new Date()`, and Bun prints that function differently).
A test pins the defaults. The legacy file keeps one hand edit, `organization.slug`'s `uniqueIndex`; this
module does not, so the file has `.unique()` there, as the generator writes it. Golden runs
`auth:generate` in the project it builds and fails unless the file comes back byte for byte.

`bun run auth:secret` prints a secret for `BETTER_AUTH_SECRET`.

## Environment

The module declares `BETTER_AUTH_SECRET` (`required`) and reads it through `readRuntimeEnv()`, never
through the shell's `app.config.ts`. A key belongs to the module that reads it (035), so neither
provider declares it.

| Provider     | Where the secret comes from                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `cloudflare` | `.dev.vars` in `apps/api` for `wrangler dev`, `wrangler secret put BETTER_AUTH_SECRET` when deployed |
| `dockerfile` | the container's environment, or generated into `DATA_DIR/secrets` on first start when unset          |

The dockerfile runtime's generation is container behaviour inside its `readRuntimeEnv`; auth finds the
value there and an operator's own wins. Under `NODE_ENV=test` a missing secret gets a fixture. Anywhere
else a missing one fails the first request that needs auth, naming the key.

`RESEND_API_KEY` is not auth's: it waits for the `email` module.

## Email

Auth does not send email. It asks an `AuthMailer` (`sendVerificationEmail`, `sendPasswordReset`), and
the `mailer` exported by `src/mailer.ts` is what `auth.module.ts` hands it. With no `email` module that
is `unconfiguredMailer`: it sends nothing and logs a warning that names the user and never the link,
which carries a one-time token. `requireEmailVerification` stays on, so **a user who signs up in a
project with no email module cannot sign in** until one is wired in; the seeded admin is verified.

The `email` module replaces the `mailer` value with an adapter over its own package, through the
intention it ships (spec 065): auth owns the interface, never the reverse.

## Not here

- **Wiring into `apps/api` and the schema barrel.** The `.use(authModule)` in `apps/api/src/app.ts`,
  the `{{SCOPE}}/auth` dependency of `apps/api` and of `packages/db`, and the `ts.addNamedExport` of
  the tables into `packages/db/src/schema/index.ts` need the `package.dependencies` patch (060).
- **`authService` and `dbService`** of the legacy module, which decorated the context with the auth
  instance and an empty `db`. Nothing read them but the macro.
- **`lib/email.ts` and the React emails** (the `email` module's), and `getAuthClientConfig`, which
  nothing imported.
