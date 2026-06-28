import { apiResponse } from "@http/response.ts";
import {
  ProfileConflictError,
  ProfileValidationError,
} from "@services/user/profile.service.ts";

/**
 * Maps profile service errors to standardized HTTP responses.
 */
export function mapProfileServiceError(error: unknown): Response | null {
  if (error instanceof ProfileValidationError) {
    return apiResponse.badRequest(error.message);
  }
  if (error instanceof ProfileConflictError) {
    return apiResponse.error(409, "conflict", "Conflict.", {
      field: error.field,
      reason: error.reason,
    });
  }
  return null;
}
