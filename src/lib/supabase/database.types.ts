/**
 * Hand-maintained database types mirroring `supabase/migrations`.
 *
 * Regenerate from a running database with:
 *   supabase gen types typescript --local > src/lib/supabase/database.types.ts
 *
 * Kept in sync manually for the Phase 1 foundation so the app typechecks
 * without a live database connection.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RoleScope = "system" | "community";
export type FeatureFlagType = "boolean" | "percentage" | "targeted";
export type FeatureFlagTargetType = "user" | "role" | "community";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type ProfileRow = Timestamps & {
  id: string;
  owner_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  metadata: Json;
  deleted_at: string | null;
};
type ProfileInsert = {
  id?: string;
  owner_id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  metadata?: Json;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type CommunityRow = Timestamps & {
  id: string;
  name: string;
  slug: string;
  settings: Json;
  deleted_at: string | null;
};
type CommunityInsert = {
  id?: string;
  name: string;
  slug: string;
  settings?: Json;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type CommunityMemberRow = Timestamps & {
  id: string;
  community_id: string;
  user_id: string;
  role_id: string;
};
type CommunityMemberInsert = {
  id?: string;
  community_id: string;
  user_id: string;
  role_id: string;
  created_at?: string;
  updated_at?: string;
};

type RoleRow = Timestamps & {
  id: string;
  name: string;
  slug: string;
  scope: RoleScope;
  is_system: boolean;
};
type RoleInsert = {
  id?: string;
  name: string;
  slug: string;
  scope?: RoleScope;
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
};

type PermissionRow = Timestamps & {
  id: string;
  resource: string;
  action: string;
  description: string | null;
};
type PermissionInsert = {
  id?: string;
  resource: string;
  action: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};

type RolePermissionRow = {
  role_id: string;
  permission_id: string;
  created_at: string;
};
type RolePermissionInsert = {
  role_id: string;
  permission_id: string;
  created_at?: string;
};

type UserRoleRow = {
  id: string;
  user_id: string;
  role_id: string;
  community_id: string | null;
  created_at: string;
};
type UserRoleInsert = {
  id?: string;
  user_id: string;
  role_id: string;
  community_id?: string | null;
  created_at?: string;
};

type AuditLogRow = {
  id: string;
  actor_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Json;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};
type AuditLogInsert = {
  id?: string;
  actor_id?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  metadata?: Json;
  ip?: string | null;
  user_agent?: string | null;
  created_at?: string;
};

type FeatureFlagRow = Timestamps & {
  id: string;
  key: string;
  description: string | null;
  type: FeatureFlagType;
  default_value: boolean;
  rollout_percentage: number;
  environments: Json;
  is_active: boolean;
};
type FeatureFlagInsert = {
  id?: string;
  key: string;
  description?: string | null;
  type?: FeatureFlagType;
  default_value?: boolean;
  rollout_percentage?: number;
  environments?: Json;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type FeatureFlagTargetRow = {
  id: string;
  flag_id: string;
  target_type: FeatureFlagTargetType;
  target_id: string;
  value: boolean;
  created_at: string;
};
type FeatureFlagTargetInsert = {
  id?: string;
  flag_id: string;
  target_type: FeatureFlagTargetType;
  target_id: string;
  value: boolean;
  created_at?: string;
};

type AnalyticsEventRow = {
  id: string;
  event_name: string;
  user_id: string | null;
  session_id: string | null;
  properties: Json;
  environment: string;
  created_at: string;
};
type AnalyticsEventInsert = {
  id?: string;
  event_name: string;
  user_id?: string | null;
  session_id?: string | null;
  properties?: Json;
  environment?: string;
  created_at?: string;
};

type SearchDocumentRow = Timestamps & {
  id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  body: string | null;
  metadata: Json;
};
type SearchDocumentInsert = {
  id?: string;
  entity_type: string;
  entity_id: string;
  title: string;
  body?: string | null;
  metadata?: Json;
  created_at?: string;
  updated_at?: string;
};

type NotificationRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  action_url: string | null;
  metadata: Json;
  read_at: string | null;
  created_at: string;
};
type NotificationInsert = {
  id?: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  action_url?: string | null;
  metadata?: Json;
  read_at?: string | null;
  created_at?: string;
};

type TableDef<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow, ProfileInsert>;
      communities: TableDef<CommunityRow, CommunityInsert>;
      community_members: TableDef<CommunityMemberRow, CommunityMemberInsert>;
      roles: TableDef<RoleRow, RoleInsert>;
      permissions: TableDef<PermissionRow, PermissionInsert>;
      role_permissions: TableDef<RolePermissionRow, RolePermissionInsert>;
      user_roles: TableDef<UserRoleRow, UserRoleInsert>;
      audit_logs: TableDef<AuditLogRow, AuditLogInsert>;
      feature_flags: TableDef<FeatureFlagRow, FeatureFlagInsert>;
      feature_flag_targets: TableDef<
        FeatureFlagTargetRow,
        FeatureFlagTargetInsert
      >;
      analytics_events: TableDef<AnalyticsEventRow, AnalyticsEventInsert>;
      search_documents: TableDef<SearchDocumentRow, SearchDocumentInsert>;
      notifications: TableDef<NotificationRow, NotificationInsert>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role_scope: RoleScope;
      feature_flag_type: FeatureFlagType;
      feature_flag_target_type: FeatureFlagTargetType;
    };
    CompositeTypes: Record<string, never>;
  };
};
