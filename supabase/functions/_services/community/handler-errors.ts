import { apiResponse } from "@http/response.ts";
import {
  CommunityConflictError,
  CommunityNotFoundError,
  CommunityValidationError,
  InviteEmailMismatchError,
  InviteExpiredError,
} from "@services/community/errors.ts";

/**
 * Maps community service errors to standardized HTTP responses.
 */
export function mapCommunityServiceError(error: unknown): Response | null {
  if (error instanceof CommunityValidationError) {
    return apiResponse.badRequest(error.message);
  }
  if (error instanceof CommunityConflictError) {
    return apiResponse.error(409, "conflict", error.message);
  }
  if (error instanceof CommunityNotFoundError) {
    return apiResponse.notFound(error.message);
  }
  if (error instanceof InviteExpiredError) {
    return apiResponse.badRequest(error.message);
  }
  if (error instanceof InviteEmailMismatchError) {
    return apiResponse.forbidden(error.message);
  }
  return null;
}
