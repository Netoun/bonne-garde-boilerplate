#!/usr/bin/env bun
/**
 * Génère docs/COMMANDS.md à partir des scripts déclarés dans tous les package.json
 * du monorepo (racine + apps/* + packages/*).
 *
 * Usage :
 *   bun run gen:commands       # depuis la racine
 *   bun scripts/gen-commands.ts
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

type Pkg = {
  name?: string;
  scripts?: Record<string, string>;
};

const ROOT = resolve(import.meta.dir, "..");
const OUTPUT = join(ROOT, "docs/COMMANDS.md");

function readPkg(path: string): Pkg | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as Pkg;
}

function listWorkspaceDirs(parent: string): string[] {
  const dir = join(ROOT, parent);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => join(parent, e.name));
}

function renderTable(scripts: Record<string, string>): string {
  const rows = Object.entries(scripts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, cmd]) => `| \`${name}\` | \`${cmd.replace(/\|/g, "\\|")}\` |`);
  return ["| Script | Commande |", "|--------|----------|", ...rows].join("\n");
}

function renderSection(title: string, relPath: string, pkg: Pkg): string {
  const name = pkg.name ?? relPath;
  const scripts = pkg.scripts ?? {};
  if (Object.keys(scripts).length === 0) {
    return `### ${title}\n\n\`${name}\` — aucun script.\n`;
  }
  const invoke =
    relPath === "."
      ? "Depuis la racine"
      : `Depuis la racine : \`bun run --filter ${name} <script>\` · ou depuis \`${relPath}/\` : \`bun run <script>\``;
  return `### ${title}\n\n\`${name}\` · ${invoke}\n\n${renderTable(scripts)}\n`;
}

function main() {
  const sections: string[] = [];

  const rootPkg = readPkg(join(ROOT, "package.json"));
  if (rootPkg) {
    sections.push(renderSection("Racine", ".", rootPkg));
  }

  const workspaces = [...listWorkspaceDirs("apps"), ...listWorkspaceDirs("packages")].sort();

  for (const ws of workspaces) {
    const pkg = readPkg(join(ROOT, ws, "package.json"));
    if (!pkg) continue;
    sections.push(renderSection(ws, ws, pkg));
  }

  const now = new Date().toISOString().slice(0, 10);
  const content = `# Commandes — Table auto-générée

> ⚠️ **Ne pas éditer à la main.** Régénéré par \`bun run gen:commands\` depuis \`scripts/gen-commands.ts\`.
> Source de vérité : les \`package.json\` du monorepo. Dernière génération : ${now}.

**Règle globale** : uniquement \`bun\` / \`bunx\`. Jamais \`npm\` / \`yarn\` / \`pnpm\` / \`npx\`.

---

${sections.join("\n---\n\n")}
`;

  writeFileSync(OUTPUT, content);
  console.log(`✓ ${OUTPUT} generated (${sections.length} packages)`);
}

main();
