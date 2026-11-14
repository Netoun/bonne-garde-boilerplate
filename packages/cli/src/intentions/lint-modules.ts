import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  parseModuleManifest,
  readModuleIntention,
  type ModuleIntention,
} from "@bonne-garde/schema";
import { IntentionsLintError } from "./lint";

/** The sections 065 requires of every intention, in the order its template gives them. */
const SECTIONS = [
  "Goal",
  "Why",
  "Applies When",
  "Do Not Apply When",
  "Observable Gaps",
  "Out of Scope",
  "Reference Paths",
  "Validation",
  "Record Result",
] as const;

export type LintedModule = {
  /** `<category>/<module-id>`. */
  module: string;
  /** Ids, in execution order. */
  intentions: string[];
};

function isMissing(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

async function subdirectories(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (isMissing(error)) {
      return [];
    }
    throw error;
  }
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** What a section holds: the lines after its heading, up to the next `## `. */
function sectionBody(source: string, name: string): string | null {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${name}`);
  if (start === -1) {
    return null;
  }
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

/** Every rule of 065's "Linting" that holds of one module's `intent/` and its `module.json`. */
async function lintModule(
  registryDir: string,
  category: string,
  id: string,
  errors: string[],
): Promise<LintedModule | null> {
  const key = `${category}/${id}`;
  const dir = join(registryDir, "modules", category, id);
  let names: string[];
  try {
    names = (await readdir(join(dir, "intent"))).filter((name) => name.endsWith(".md")).sort();
  } catch (error) {
    if (isMissing(error)) {
      return null;
    }
    throw error;
  }

  const fail = (message: string) => errors.push(`${key}: ${message}`);

  let named: { variant: string; file: string }[] = [];
  try {
    const manifest = parseModuleManifest(
      JSON.parse(await readFile(join(dir, "module.json"), "utf8")),
    );
    named = manifest.variants.flatMap((variant) =>
      (variant.intent ?? []).map((file) => ({ variant: variant.key, file })),
    );
  } catch (error) {
    fail(`module.json cannot be read: ${error instanceof Error ? error.message : String(error)}`);
  }
  for (const { variant, file } of named) {
    if (!names.includes(file)) {
      fail(`variant ${variant} names ${file}, which intent/ does not hold`);
    }
  }

  const intentions: { meta: ModuleIntention; file: string; source: string }[] = [];
  for (const file of names) {
    const source = await readFile(join(dir, "intent", file), "utf8");
    try {
      intentions.push({ meta: readModuleIntention(key, file, source), file, source });
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error));
    }
    if (!named.some((entry) => entry.file === file)) {
      fail(`intent/${file} is named by no variant`);
    }
  }

  const seen = new Set<number>();
  for (const { meta } of intentions) {
    if (seen.has(meta.order)) {
      fail(`duplicate order prefix ${String(meta.order).padStart(2, "0")}`);
    }
    seen.add(meta.order);
  }

  for (const { meta, file, source } of intentions) {
    for (const required of meta.requires) {
      const earlier = intentions.find((other) => other.meta.id === required);
      if (earlier === undefined) {
        fail(`${file} requires ${required}, which no intention of the module defines`);
      } else if (earlier.meta.order >= meta.order) {
        fail(`${file} requires ${required}, which does not appear earlier in execution order`);
      }
    }

    const missing = SECTIONS.filter((name) => sectionBody(source, name) === null);
    if (missing.length > 0) {
      fail(`${file} is missing the sections: ${missing.join(", ")}`);
    }
    const references = sectionBody(source, "Reference Paths");
    if (references !== null) {
      const paths = references.split("\n").filter((line) => /^\s*[-*]\s/.test(line));
      if (paths.length === 0) {
        fail(`${file}: Reference Paths lists no path`);
      }
      for (const line of paths.filter((entry) => !/`(?:copy|adapt)`/.test(entry))) {
        fail(`${file}: Reference Paths line \`${line.trim()}\` declares neither copy nor adapt`);
      }
    }
  }

  return {
    module: key,
    intentions: [...intentions]
      .sort((a, b) => a.meta.order - b.meta.order)
      .map(({ meta }) => meta.id),
  };
}

/**
 * Spec 065 "Linting" for the intentions a module authors under `registry/modules/<category>/<id>/intent/`:
 * the same parser as the staging reads them with, the rules the format gives (id, order, `requires`,
 * sections, Reference Paths) and the two ends of `module.json`'s `intent` list, so a file no variant
 * names and a name no file answers to both fail. Reports every error at once, in module order.
 */
export async function lintModuleIntentions(registryDir: string): Promise<LintedModule[]> {
  const errors: string[] = [];
  const modules: LintedModule[] = [];

  for (const category of await subdirectories(join(registryDir, "modules"))) {
    for (const id of await subdirectories(join(registryDir, "modules", category))) {
      const linted = await lintModule(registryDir, category, id, errors);
      if (linted !== null) {
        modules.push(linted);
      }
    }
  }

  if (errors.length > 0) {
    throw new IntentionsLintError(errors);
  }
  return modules;
}
