import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("cn (class name merger)", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge resolves conflicts: p-2 then p-4 → p-4
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("conditionally includes a class when truthy", () => {
    expect(cn("base", true && "extra")).toBe("base extra");
  });

  it("omits a class when falsy", () => {
    expect(cn("base", false && "hidden")).toBe("base");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("base", undefined, null as unknown as undefined)).toBe("base");
  });

  it("returns an empty string when given no arguments", () => {
    expect(cn()).toBe("");
  });
});
