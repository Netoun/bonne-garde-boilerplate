import { describe, expect, test } from "bun:test";
import { parseFrontmatter, readModuleIntention } from "./intention-document";

const document = (frontmatter: string, body = "# Wire the mailer\n\n## Goal\n\nx\n") =>
  `---\n${frontmatter}\n---\n\n${body}`;

const VALID = document(
  [
    "id: email/resend/wire-email-into-auth",
    "kind: install",
    "domain: email",
    "classification: migration",
  ].join("\n"),
);

describe("parseFrontmatter", () => {
  test("reads scalars, inline lists and block lists", () => {
    expect(
      parseFrontmatter(
        document(
          [
            "id: a/b/c",
            'domain: "email"',
            "requires:",
            "  - a/b/one",
            "  - a/b/two",
            "tags: [x, y]",
          ].join("\n"),
        ),
      ),
    ).toEqual({
      id: "a/b/c",
      domain: "email",
      requires: ["a/b/one", "a/b/two"],
      tags: ["x", "y"],
    });
  });

  test("refuses a file that does not start with frontmatter, or never closes it", () => {
    expect(() => parseFrontmatter("# no frontmatter\n")).toThrow(/missing frontmatter/);
    expect(() => parseFrontmatter("---\nid: a\n")).toThrow(/unclosed frontmatter/);
  });
});

describe("readModuleIntention: the intention a module authors under intent/ (065)", () => {
  test("is read by its file name and frontmatter: id, order, slug, the heading as the title", () => {
    expect(readModuleIntention("email/resend", "01-wire-email-into-auth.md", VALID)).toEqual({
      id: "email/resend/wire-email-into-auth",
      order: 1,
      slug: "wire-email-into-auth",
      domain: "email",
      classification: "migration",
      requires: [],
      title: "Wire the mailer",
    });
  });

  test("carries requires, in the order written", () => {
    const meta = readModuleIntention(
      "email/resend",
      "02-two.md",
      document(
        [
          "id: email/resend/two",
          "kind: install",
          "domain: email",
          "classification: informational",
          "requires:",
          "  - email/resend/one",
        ].join("\n"),
      ),
    );

    expect(meta.requires).toEqual(["email/resend/one"]);
  });

  test.each([
    ["a file name without the NN- order prefix", "wire.md", VALID, /must be named NN-slug\.md/],
    [
      "an id that is not <category>/<module-id>/<slug> of the module and the file",
      "01-other.md",
      VALID,
      /id must be email\/resend\/other, got email\/resend\/wire-email-into-auth/,
    ],
    [
      "a kind other than install",
      "01-wire-email-into-auth.md",
      VALID.replace("kind: install", "kind: migration"),
      /kind must be install/,
    ],
    [
      "a domain that is not the module's category",
      "01-wire-email-into-auth.md",
      VALID.replace("domain: email", "domain: auth"),
      /domain must be email/,
    ],
    [
      "a classification this format does not know",
      "01-wire-email-into-auth.md",
      VALID.replace("classification: migration", "classification: nice-to-have"),
      /classification must be one of informational, migration, breaking-manual/,
    ],
    [
      "no frontmatter",
      "01-wire-email-into-auth.md",
      "# Wire\n",
      /01-wire-email-into-auth\.md: missing frontmatter/,
    ],
  ])("refuses %s", (_what, fileName, source, message) => {
    expect(() => readModuleIntention("email/resend", fileName, source)).toThrow(message);
  });
});
