import { toast } from "sonner";

import { getUserErrorMessage } from "@/lib/toast/user-message";

export interface MutationToastMessages {
  loading: string;
  success: string;
  errorFallback: string;
  resolveErrorMessage?: (error: unknown) => string | undefined;
}

/**
 * Wraps an async mutation with visible loading, success, and error toasts.
 * Use from colocated UI hooks only — not TanStack mutation files.
 */
export async function runMutationWithToast<T>(
  mutation: Promise<T>,
  messages: MutationToastMessages,
): Promise<T> {
  return toast
    .promise(mutation, {
      loading: messages.loading,
      success: messages.success,
      error: (error) =>
        messages.resolveErrorMessage?.(error) ??
        getUserErrorMessage(error, messages.errorFallback),
    })
    .unwrap();
}
