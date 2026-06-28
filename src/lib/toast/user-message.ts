import { toast } from "sonner";

import { getAuthErrorMessage, isAuthLikeError } from "@/lib/auth/user-message";
import { EdgeFunctionError } from "@/lib/edge-function/request";

/**
 * Returns a plain-language message suitable for our audience. Prefers the
 * server-provided user message when available.
 */
export function getUserErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof EdgeFunctionError) {
    return error.message;
  }
  if (isAuthLikeError(error)) {
    return getAuthErrorMessage(error, fallback);
  }
  if (error instanceof Error && error.name !== "Error" && error.message) {
    return error.message;
  }
  return fallback;
}

export function showSuccess(message: string): void {
  toast.success(message);
}

export function showUserError(error: unknown, fallback: string): void {
  toast.error(getUserErrorMessage(error, fallback));
}
