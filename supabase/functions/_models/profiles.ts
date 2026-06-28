import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * All `.from("profiles")` access lives here. No cross-table orchestration.
 */
export interface ProfileRow {
  id: string;
  owner_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  updated_at: string;
}

const COLUMNS = "id, owner_id, display_name, avatar_url, bio, updated_at";

export async function getProfileByOwnerId(
  client: SupabaseClient,
  ownerId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await client
    .from("profiles")
    .select(COLUMNS)
    .eq("owner_id", ownerId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ProfileRow | null;
}

export async function updateProfileByOwnerId(
  client: SupabaseClient,
  ownerId: string,
  patch: { display_name?: string | null; bio?: string; avatar_url?: string },
): Promise<ProfileRow> {
  const { data, error } = await client
    .from("profiles")
    .update(patch)
    .eq("owner_id", ownerId)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as ProfileRow;
}

export async function isDisplayNameTaken(
  client: SupabaseClient,
  displayName: string,
  excludeOwnerId: string,
): Promise<boolean> {
  const { data, error } = await client.rpc("is_display_name_taken", {
    p_display_name: displayName,
    p_exclude_owner_id: excludeOwnerId,
  });

  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function countProfiles(client: SupabaseClient): Promise<number> {
  const { count, error } = await client
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
