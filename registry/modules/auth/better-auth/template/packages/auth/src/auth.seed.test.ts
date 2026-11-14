import { describe, it, expect } from "bun:test";
import { getTableName, is, sql } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { member, organization, user } from "./schema";
import * as authSchema from "./schema";
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_TABLES, resetStatements, seedStatements } from "./seed";
import { createTestAuth } from "./testing";

// The seed writes the rows Better Auth would, with SQL, because it runs against a local D1 through
// `wrangler d1 execute`. What proves it is Better Auth reading them back.
describe("the seed", () => {
  async function seeded() {
    const test = await createTestAuth();
    for (const statement of await seedStatements()) {
      await test.db.run(sql.raw(statement));
    }
    return test;
  }

  it("creates an admin who signs in with the password it announces, through Better Auth", async () => {
    const { auth } = await seeded();

    const signedIn = await auth.api.signInEmail({
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });

    expect(signedIn.user.email).toBe(ADMIN_EMAIL);
    expect(signedIn.user.emailVerified).toBe(true);
  });

  it("refuses the wrong password: the hash is Better Auth's format, not a placeholder", async () => {
    const { auth } = await seeded();

    await expect(
      auth.api.signInEmail({ body: { email: ADMIN_EMAIL, password: "not the password" } }),
    ).rejects.toThrow();
  });

  it("makes the admin the owner of a Personal organization, and opens a session on it", async () => {
    const { auth, db } = await seeded();

    const signedIn = await auth.api.signInEmail({
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });

    const [row] = await db
      .select({ name: organization.name, role: member.role, id: organization.id })
      .from(member)
      .innerJoin(organization, sql`${member.organizationId} = ${organization.id}`);
    expect(row).toMatchObject({ name: "Personal", role: "owner" });
    expect(signedIn.user.id).toBe((await db.select().from(user))[0]?.id ?? "");
  });

  it("is what reset empties: every auth table, in an order a foreign key accepts, and it seeds again", async () => {
    const { db, call, signIn, auth } = await seeded();
    await signIn("someone@example.com");
    await db.run(sql`PRAGMA foreign_keys = ON`);

    for (const statement of resetStatements()) {
      await db.run(sql.raw(statement));
    }

    for (const table of AUTH_TABLES) {
      const [counted] = await db.all<{ n: number }>(
        sql.raw(`SELECT count(*) AS n FROM "${table}"`),
      );
      expect([table, counted?.n]).toEqual([table, 0]);
    }
    for (const statement of await seedStatements()) {
      await db.run(sql.raw(statement));
    }
    expect(
      (await auth.api.signInEmail({ body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })).user
        .email,
    ).toBe(ADMIN_EMAIL);
    expect((await call("/get-session")).status).toBe(200);
  });

  it("clears the tables of the schema and no other: medias is storage's, and it clears its own", () => {
    const tables = Object.values(authSchema)
      .filter((value) => is(value, SQLiteTable))
      .map(getTableName);

    expect([...AUTH_TABLES].sort()).toEqual([...tables].sort());
    expect(resetStatements().join(" ")).not.toContain("medias");
  });
});
