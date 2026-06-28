/**
 * Wire contracts for access-control endpoints. Pure types, shared across
 * runtimes.
 */
export interface PermissionsResponse {
  roles: string[];
  permissions: string[];
}
