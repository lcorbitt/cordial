/**
 * Wire contracts for profile endpoints. Pure types, shared across runtimes.
 */
export interface ProfileResponse {
  id: string;
  ownerId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  updatedAt: string;
}

export interface UpdateProfileBody {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}
