const MAX_ILIKE_LENGTH = 100;

/**
 * Escapes user input for safe use inside PostgREST ILIKE patterns.
 */
export function escapeIlikePattern(raw: string): string {
  const trimmed = raw.trim().slice(0, MAX_ILIKE_LENGTH);
  return trimmed.replace(/[%_\\]/g, "\\$&");
}

export function normalizeSearchTerm(raw: string | null | undefined): string {
  if (!raw) {
    return "";
  }

  return escapeIlikePattern(raw);
}
