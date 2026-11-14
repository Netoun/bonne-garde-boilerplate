import { afterAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const PACKED = join(ROOT, "dist/npm/create-bonne-garde");

describe("pack-cli", () => {
  const dirs: string[] = [];
  afterAll(async () => {
    await Promise.all(dirs.map((d) => rm(d, { recursive: true, force: true })));
  });

  test("packed create-bonne-garde creates a project from embedded templates", async () => {
    const pack = Bun.spawn(["bun", "scripts/pack-cli.ts"], {
      cwd: ROOT,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(await pack.exited).toBe(0);
    // What `bunx create-bonne-garde` does first: fetch the packed package's own dependencies.
    const install = Bun.spawn(["bun", "install"], {
      cwd: PACKED,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(await install.exited).toBe(0);

    const parent = await mkdtemp(join(tmpdir(), "bg-pack-"));
    dirs.push(parent);

    const create = Bun.spawn(
      [
        "bun",
        join(PACKED, "src/create-bin.ts"),
        "packed-app",
        "--yes",
        "--no-git",
        "--no-install",
        "--registry",
        `local:${join(ROOT, "registry")}`,
      ],
      {
        cwd: parent,
        stdout: "pipe",
        stderr: "pipe",
      },
    );
    const code = await create.exited;
    const stderr = await new Response(create.stderr).text();
    expect(code).toBe(0);
    expect(stderr).toBe("");

    const bg = await Bun.file(join(parent, "packed-app/bg.json")).json();
    expect(bg.version).toBe(2);
    expect(bg.scope).toBe("@packed-app");
  });

  test("the packed package declares the npm dependencies of the registry package it bundles, pinned as they are", async () => {
    const pack = Bun.spawn(["bun", "scripts/pack-cli.ts"], {
      cwd: ROOT,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(await pack.exited).toBe(0);

    const registry = await Bun.file(join(ROOT, "packages/registry/package.json")).json();
    const packed = await Bun.file(join(PACKED, "package.json")).json();

    // The workspace packages are bundled in; what remains is what `bun install` has to fetch.
    const external = Object.fromEntries(
      Object.entries<string>(registry.dependencies).filter(
        ([name]) => !name.startsWith("@bonne-garde/"),
      ),
    );
    // Both are pinned to an exact version: a patch's output depends on what parses the file.
    expect(external).toEqual({
      "jsonc-parser": expect.stringMatching(/^\d+\.\d+\.\d+$/),
      "ts-morph": expect.stringMatching(/^\d+\.\d+\.\d+$/),
    });
    expect(packed.dependencies).toEqual(external);
  });

  test("a workspace package is imported by a path that resolves from where the file lies, at any depth of src/", async () => {
    const pack = Bun.spawn(["bun", "scripts/pack-cli.ts"], {
      cwd: ROOT,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(await pack.exited).toBe(0);

    const dangling: string[] = [];
    const left: string[] = [];
    for (const dir of ["src", "lib"]) {
      for await (const path of new Bun.Glob("**/*.ts").scan({ cwd: join(PACKED, dir) })) {
        const file = join(PACKED, dir, path);
        const source = await Bun.file(file).text();
        for (const [, specifier] of source.matchAll(
          /from "(@bonne-garde\/[^"]+|\.{1,2}\/[^"]+)"/g,
        )) {
          if (specifier === undefined) continue;
          if (specifier.startsWith("@")) {
            left.push(`${dir}/${path}: ${specifier}`);
          } else if (
            ![specifier, `${specifier}.ts`, `${specifier}/index.ts`].some((candidate) =>
              existsSync(join(dirname(file), candidate)),
            )
          ) {
            dangling.push(`${dir}/${path}: ${specifier}`);
          }
        }
      }
    }

    // Packing copies a workspace package in and rewrites what names it: both a name left and a path
    // that climbs the wrong number of directories (src/intentions/ is one deeper than src/) break the CLI.
    expect(left).toEqual([]);
    expect(dangling).toEqual([]);
  });
});
