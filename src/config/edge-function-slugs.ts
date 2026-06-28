/**
 * Single registry of Supabase Edge Function slugs. Every frontend service and
 * SSR loader references slugs from here — never hardcoded URL strings. Renaming
 * a slug means changing it here, the function folder, and `config.toml`
 * together.
 *
 * Naming: verb-kebab-noun. CRUD verbs by default; domain verbs when CRUD
 * misleads (e.g. accept-invite). Do not use possessive scope (no "my") —
 * the authenticated caller is implied by JWT/session.
 */
export const EDGE_FUNCTION_SLUGS = {
  getHealth: "get-health",
  getProfile: "get-profile",
  updateProfile: "update-profile",
  getPermissions: "get-permissions",
  getFeatureFlag: "get-feature-flag",
  getAdminOverview: "get-admin-overview",
  listCommunities: "list-communities",
  getCommunity: "get-community",
  createCommunity: "create-community",
  listAdminCommunities: "list-admin-communities",
  sendCommunityInvite: "send-community-invite",
  acceptInvite: "accept-invite",
  createAvatarUploadUrl: "create-avatar-upload-url",
  listNotifications: "list-notifications",
  markNotificationRead: "mark-notification-read",
} as const;

export type EdgeFunctionSlug =
  (typeof EDGE_FUNCTION_SLUGS)[keyof typeof EDGE_FUNCTION_SLUGS];
