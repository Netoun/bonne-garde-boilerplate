# Tests — Patterns & Setup

> General rules (TDD, coverage, prohibitions) → [`RULES.md`](./RULES.md#2-tdd--test-driven-development).
> This file documents **how** to test each app.

---

## Stack

| App | Runner | Env | HTTP Mock | Command |
|-----|--------|-----|-----------|---------|
| `apps/api` | `bun:test` (native) | `bun:sqlite` in-memory | None (real DB) | `bun test` |
| `apps/spa` | Vitest + RTL | `jsdom` | MSW | `bun run test` |
| `apps/ssr` | Vitest + RTL | `jsdom` | MSW | `bun run test` |

From root: `bun run test` (parallel, all apps).

---

## apps/api — Elysia + Drizzle + SQLite in-memory

### Principle

- **Real DB** via `bun:sqlite` (memory) — never mock Drizzle.
- Drizzle migrations run at test startup → schema always in sync with prod.
- Elysia routes tested via `treaty(app)` (Eden) **without** starting an HTTP server.
- One `createTestDb()` per `beforeEach` → total test isolation.

### Shared Setup

File: `apps/api/src/modules/test/db.test.ts`

```typescript
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as authSchema from "../db/schemas/db.auth-schema";
import * as coreSchema from "../db/schemas/db.core-schema";

const schema = { ...authSchema, ...coreSchema };

export function createTestDb() {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema });
  const migrationsDir = new URL("../db/migrations", import.meta.url).pathname;
  migrate(db, { migrationsFolder: migrationsDir });
  return db;
}

export type TestDb = ReturnType<typeof createTestDb>;
```

### Route E2E Pattern

```typescript
import { describe, it, expect, beforeEach } from "bun:test";
import { Elysia } from "elysia";
import { treaty } from "@elysiajs/eden";
import { createTestDb, type TestDb } from "../test/db.test";
import { OrganizationService } from "./organizations.service";

describe("Organizations API (E2E)", () => {
  let db: TestDb;
  let api: ReturnType<typeof treaty>;

  beforeEach(async () => {
    db = createTestDb();

    // minimal seed (user + session)
    await db.insert(user).values({ /* ... */ });

    const app = new Elysia()
      .decorate("db", db)
      .use(OrganizationService)
      .get("/v1/organizations", ({ organizationService }) =>
        organizationService.getUserOrganizations("user-1"),
      );

    api = treaty(app);
  });

  it("returns 200 with orgs", async () => {
    const { data, error } = await api.v1.organizations.get();
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

### API Checklist

- [ ] All status codes covered (200, 400, 401, 403, 404)
- [ ] Happy path + edge cases
- [ ] `beforeEach` that recreates DB (isolation)
- [ ] No Drizzle mock, ever
- [ ] No `fetch` — use `treaty(app)`

### tsconfig

`apps/api/tsconfig.test.json` is **separate** from `tsconfig.json` because `@cloudflare/workers-types` and `bun-types` don't coexist. The `bun test` runner automatically uses the correct one.

---

## apps/spa & apps/ssr — Vitest + RTL + MSW

### Shared Setup

- `jsdom` environment
- `@testing-library/jest-dom` imported globally
- MSW server starts before all tests, resets after each, closes at the end
- `onUnhandledRequest: 'error'` — **any unmocked HTTP call fails the test**

`apps/spa/tests/setup.ts`:
```typescript
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Adding an MSW Handler

File: `apps/spa/tests/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('http://localhost:5172/v1/organizations', () =>
    HttpResponse.json([{ id: 'org-1', slug: 'acme', name: 'ACME' }]),
  ),
]
```

**Rule**: one handler per endpoint, occasional override in test via `server.use(...)` to simulate an error.

### Component Pattern (user interaction)

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

describe('LoginForm', () => {
  it('submits credentials and shows success', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'a@b.co')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/welcome/i)).toBeInTheDocument()
  })
})
```

**Rule**: test what the user sees/does — never the component's internal state.

### Loader Pattern (player SSR)

```typescript
import { describe, it, expect } from 'vitest'
import { loader } from '~/routes/games.$slug'

describe('loader — /games/:slug', () => {
  it('returns game data on success', async () => {
    const response = await loader({
      params: { slug: 'foo' },
      request: new Request('http://t/games/foo'),
      context: {},
    } as any)
    expect(response).toMatchObject({ slug: 'foo' })
  })

  it('throws 404 when not found', async () => {
    server.use(
      http.get('*/v1/games/foo', () => new HttpResponse(null, { status: 404 })),
    )
    await expect(
      loader({ params: { slug: 'foo' }, request: new Request('http://t/'), context: {} } as any),
    ).rejects.toThrow()
  })
})
```

Cover: **nominal case + all error cases** (404, 401, 500…).

### Front Checklist

- [ ] User interactions tested (not implementation)
- [ ] MSW handler for each endpoint called
- [ ] No `vi.mock('module')` — MSW only
- [ ] No snapshot tests
- [ ] Loaders: nominal case + errors

---

## Commands

```bash
# All (from root)
bun run test

# Per app
bun run --filter @bonne-garde/api test
bun run --filter @bonne-garde/spa test
bun run --filter @bonne-garde/ssr test

# Watch mode (from the app)
cd apps/api && bun run test:watch
cd apps/spa && bun run test:watch
```

---

## Prohibitions — Reminder

- ❌ Mock Drizzle / `bun:sqlite`
- ❌ `vi.mock()` on a business module — refactor for dependency injection instead
- ❌ Snapshot tests
- ❌ Manually mocked `fetch` — MSW only on front
- ❌ Testing via a launched HTTP server on API side — use `treaty(app)`
- ❌ Testing component implementation details (internal state, methods)
