/**
 * The intention document of spec 065: frontmatter, then sections. The parser is shared by every
 * reader of one: the registry that plans a module's `intent/`, the CLI that stages and lints it.
 */

export function parseFrontmatter(source: string): Record<string, unknown> {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) {
    throw new Error("missing frontmatter");
  }
  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("unclosed frontmatter");
  }
  const block = source.slice(4, end).replace(/\r/g, "");
  const result: Record<string, unknown> = {};
  let currentKey: string | null = null;
  let listMode = false;

  for (const line of block.split("\n")) {
    if (listMode && currentKey) {
      const listItem = line.match(/^\s+-\s+(.+)$/);
      if (listItem) {
        const list = result[currentKey];
        if (Array.isArray(list)) {
          list.push(listItem[1]!.trim());
        }
        continue;
      }
      listMode = false;
      currentKey = null;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1]!;
    const raw = match[2]!;
    if (raw === "" || raw === "|" || raw === ">") {
      result[key] = [];
      currentKey = key;
      listMode = true;
      continue;
    }
    if (raw.startsWith("[") && raw.endsWith("]")) {
      const inner = raw.slice(1, -1).trim();
      result[key] = inner ? inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")) : [];
      continue;
    }
    result[key] = raw.replace(/^["']|["']$/g, "");
    currentKey = key;
    listMode = false;
  }

  return result;
}

export const INTENTION_CLASSIFICATIONS = ["informational", "migration", "breaking-manual"] as const;

/** `NN-slug.md`: the prefix is the execution order, the slug is the last segment of the id. */
export const INTENTION_FILE_RE = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

export type ModuleIntention = {
  id: string;
  order: number;
  slug: string;
  domain: string;
  classification: string;
  requires: string[];
  /** The text of the first `# ` heading, when the document has one. */
  title?: string;
};

/**
 * Reads an intention a module authors under `intent/` (065, "Layout" and "Frontmatter"): the id is
 * `<category>/<module-id>/<slug>`, the slug being the file's own, the kind is `install` and the
 * domain is the module's category. Throws an `Error` naming the file on the first rule it breaks.
 * `moduleKey` is `<category>/<module-id>`.
 */
export function readModuleIntention(
  moduleKey: string,
  fileName: string,
  source: string,
): ModuleIntention {
  const fileMatch = INTENTION_FILE_RE.exec(fileName);
  if (!fileMatch) {
    throw new Error(`${fileName}: must be named NN-slug.md (zero-padded order + kebab slug)`);
  }
  const order = Number(fileMatch[1]);
  const slug = fileMatch[2]!;

  let frontmatter: Record<string, unknown>;
  try {
    frontmatter = parseFrontmatter(source);
  } catch (error) {
    throw new Error(`${fileName}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const text = (field: string): string => {
    const value = frontmatter[field];
    if (typeof value !== "string" || value.length === 0) {
      throw new Error(`${fileName}: ${field} must be a non-empty string`);
    }
    return value;
  };

  const id = text("id");
  const expectedId = `${moduleKey}/${slug}`;
  if (id !== expectedId) {
    throw new Error(`${fileName}: id must be ${expectedId}, got ${id}`);
  }
  if (text("kind") !== "install") {
    throw new Error(`${fileName}: kind must be install, got ${text("kind")}`);
  }
  const category = moduleKey.split("/")[0] ?? "";
  const domain = text("domain");
  if (domain !== category) {
    throw new Error(`${fileName}: domain must be ${category}, got ${domain}`);
  }
  const classification = text("classification");
  if (!(INTENTION_CLASSIFICATIONS as readonly string[]).includes(classification)) {
    throw new Error(
      `${fileName}: classification must be one of ${INTENTION_CLASSIFICATIONS.join(", ")}`,
    );
  }
  const requires = frontmatter.requires ?? [];
  if (!Array.isArray(requires) || requires.some((entry) => typeof entry !== "string")) {
    throw new Error(`${fileName}: requires must be a list of strings`);
  }

  const title = /^# (.+)$/m.exec(source.slice(source.indexOf("\n---", 4) + 4))?.[1]?.trim();
  return {
    id,
    order,
    slug,
    domain,
    classification,
    requires: requires as string[],
    ...(title === undefined ? {} : { title }),
  };
}
