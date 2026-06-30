import { describe, expect, it } from "vitest";

import { auditLogDateRangeCutoff } from "@shared/admin/audit-log-catalog";
import { escapeIlikePattern, normalizeSearchTerm } from "@shared/db/ilike";

describe("escapeIlikePattern", () => {
  it("escapes ilike wildcard characters", () => {
    expect(escapeIlikePattern("100%_done\\")).toBe("100\\%\\_done\\\\");
  });

  it("trims and caps search length", () => {
    const longTerm = ` ${"a".repeat(120)} `;
    expect(escapeIlikePattern(longTerm)).toHaveLength(100);
  });
});

describe("normalizeSearchTerm", () => {
  it("returns empty string for blank input", () => {
    expect(normalizeSearchTerm("   ")).toBe("");
    expect(normalizeSearchTerm(null)).toBe("");
  });
});

describe("auditLogDateRangeCutoff", () => {
  it("returns null for all time", () => {
    expect(auditLogDateRangeCutoff("all")).toBeNull();
  });

  it("returns an iso timestamp for preset ranges", () => {
    const now = Date.now();
    const cutoff = auditLogDateRangeCutoff("7d");

    expect(cutoff).not.toBeNull();
    expect(Date.parse(cutoff!)).toBeLessThanOrEqual(now);
  });
});
