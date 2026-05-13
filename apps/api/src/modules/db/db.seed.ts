import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

import { scrypt, randomBytes } from "node:crypto";

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err);
      else resolve(`${salt}:${derived.toString("hex")}`);
    });
  });
}

import { user, account, organization, member } from "./schemas/db.auth-schema";

const TEMP_DB_PATH = join(import.meta.dir, ".seed-temp.sqlite");
const MIGRATIONS_DIR = join(import.meta.dir, "migrations");

const ADMIN_EMAIL = "admin@bonne-garde.local";
const ADMIN_PASSWORD = "password123";

function getMigrationFiles(): string[] {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  return files.map((f) => join(MIGRATIONS_DIR, f));
}

async function main() {
  console.log("Cleaning D1 database...");
  const cleanProc = Bun.spawn([
    "bunx",
    "wrangler",
    "d1",
    "execute",
    "my-app-db",
    "--local",
    "--command=DELETE FROM member; DELETE FROM organization; DELETE FROM account; DELETE FROM user; DELETE FROM verification; DELETE FROM session; DELETE FROM invitation;",
  ]);
  const cleanExit = await cleanProc.exited;
  if (cleanExit !== 0) {
    console.error("Cleanup failed");
    process.exit(1);
  }

  console.log("Applying migrations...");
  const migrateProc = Bun.spawn([
    "bunx",
    "wrangler",
    "d1",
    "migrations",
    "apply",
    "my-app-db",
    "--local",
  ]);
  const migrateExit = await migrateProc.exited;
  if (migrateExit !== 0) {
    console.error("Migration failed");
    process.exit(1);
  }

  console.log("Creating temp DB...");
  try {
    await Bun.spawn(["rm", "-f", TEMP_DB_PATH]).exited;
  } catch {
    // ignore
  }
  const client = new Database(TEMP_DB_PATH);

  console.log("Applying migrations...");
  const migrationFiles = getMigrationFiles();
  for (const filePath of migrationFiles) {
    console.log(`  Applying ${filePath.split("/").pop()}...`);
    const migrationSQL = readFileSync(filePath, "utf-8");
    const statements = migrationSQL
      .split(/--> statement-breakpoint/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        client.exec(stmt);
      } catch (e) {
        console.error(`    Error executing statement: ${stmt.substring(0, 100)}...`);
        throw e;
      }
    }
  }

  const db = drizzle(client);

  console.log("Seeding...");

  const now = new Date();
  const adminId = crypto.randomUUID();

  try {
    await db.insert(user).values({
      id: adminId,
      name: "Admin",
      email: ADMIN_EMAIL,
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    });

    const hashedPassword = await hashPassword(ADMIN_PASSWORD);

    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: adminId,
      providerId: "credential",
      userId: adminId,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    const orgId = crypto.randomUUID();
    await db.insert(organization).values({
      id: orgId,
      name: "Personal",
      slug: "personal",
      logo: null,
      createdAt: now,
      metadata: null,
    });

    await db.insert(member).values({
      id: crypto.randomUUID(),
      organizationId: orgId,
      userId: adminId,
      role: "owner",
      createdAt: now,
    });

    console.log("Seed completed!");
    console.log("Admin account created:");
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  Organization: Personal (owner)`);
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
