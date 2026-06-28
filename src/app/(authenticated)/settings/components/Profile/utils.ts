import { EdgeFunctionError } from "@/lib/edge-function/request";
import {
  PROFILE_CONFLICT_FIELDS,
  PROFILE_CONFLICT_REASONS,
} from "@shared/profile/validation";

import { DISPLAY_NAME_TAKEN_BODY } from "./constants";

type ProfileFieldError = {
  field: "displayName";
  message: string;
};

/**
 * Maps profile API conflict reason codes to colocated UI copy for inline errors.
 */
export function resolveProfileFieldError(
  error: unknown,
): ProfileFieldError | null {
  if (!(error instanceof EdgeFunctionError)) return null;
  if (error.code !== "conflict") return null;

  const reason = error.details?.reason;
  const field = error.details?.field;

  if (
    reason === PROFILE_CONFLICT_REASONS.displayNameTaken &&
    field === PROFILE_CONFLICT_FIELDS.displayName
  ) {
    return {
      field: "displayName",
      message: DISPLAY_NAME_TAKEN_BODY,
    };
  }

  return null;
}

/**
 * Resolves a user-facing toast message for profile save failures.
 */
export function resolveProfileSaveErrorMessage(
  error: unknown,
): string | undefined {
  return resolveProfileFieldError(error)?.message;
}
