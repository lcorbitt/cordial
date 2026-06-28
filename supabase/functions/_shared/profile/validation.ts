/**
 * Cross-runtime profile validation. No user-facing copy — UI strings live in
 * the feature's constants.ts; the API returns machine reason codes.
 */

export const DISPLAY_NAME_MAX_LENGTH = 80;

export const PROFILE_CONFLICT_REASONS = {
  displayNameTaken: "display_name_taken",
} as const;

export type ProfileConflictReason =
  (typeof PROFILE_CONFLICT_REASONS)[keyof typeof PROFILE_CONFLICT_REASONS];

export const PROFILE_CONFLICT_FIELDS = {
  displayName: "displayName",
} as const;

export function normalizeDisplayName(displayName: string): string {
  return displayName.trim();
}

export function isDisplayNameEmpty(displayName: string): boolean {
  return normalizeDisplayName(displayName).length === 0;
}
