import { describe, expect, it } from "vitest";

import {
  isDisplayNameEmpty,
  normalizeDisplayName,
  PROFILE_CONFLICT_REASONS,
} from "@shared/profile/validation";
import { EdgeFunctionError } from "@/lib/edge-function/request";
import {
  resolveProfileFieldError,
  resolveProfileSaveErrorMessage,
} from "@/app/(authenticated)/profile/components/Profile/utils";
import { PROFILE_COPY } from "@/app/(authenticated)/profile/components/Profile/constants";

describe("profile validation", () => {
  it("normalizes display names by trimming whitespace", () => {
    expect(normalizeDisplayName("  Alex  ")).toBe("Alex");
  });

  it("detects empty display names after normalization", () => {
    expect(isDisplayNameEmpty("   ")).toBe(true);
    expect(isDisplayNameEmpty("Alex")).toBe(false);
  });

  it("uses stable machine reason codes", () => {
    expect(PROFILE_CONFLICT_REASONS.displayNameTaken).toBe(
      "display_name_taken",
    );
  });
});

describe("resolveProfileFieldError", () => {
  it("maps display name conflict details to UI copy", () => {
    const error = new EdgeFunctionError(409, "conflict", "Conflict.", {
      field: "displayName",
      reason: PROFILE_CONFLICT_REASONS.displayNameTaken,
    });

    expect(resolveProfileFieldError(error)).toEqual({
      field: "displayName",
      message: PROFILE_COPY.displayNameTaken,
    });
    expect(resolveProfileSaveErrorMessage(error)).toBe(
      PROFILE_COPY.displayNameTaken,
    );
  });

  it("returns null for unrelated errors", () => {
    expect(
      resolveProfileFieldError(
        new EdgeFunctionError(400, "validation_error", "Bad request."),
      ),
    ).toBeNull();
  });
});
