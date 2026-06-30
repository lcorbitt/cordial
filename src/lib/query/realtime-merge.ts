/**
 * Pure TanStack cache merge helpers for Supabase Realtime payloads.
 * Used from hooks/queries/use<Domain>.ts — not from transport hooks.
 */

export function upsertById<T extends { id: string }>(
  items: readonly T[],
  row: T,
): T[] {
  const map = new Map(items.map((item) => [item.id, item]));
  map.set(row.id, row);
  return Array.from(map.values());
}

export function removeById<T extends { id: string }>(
  items: readonly T[],
  id: string,
): T[] {
  return items.filter((item) => item.id !== id);
}

export function patchSingleton<T>(
  previous: T | undefined,
  partial: Partial<T>,
): T | null {
  if (!previous) return null;
  return { ...previous, ...partial };
}
