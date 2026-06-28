/**
 * Wire contracts for feature-flag endpoints. Pure types, shared across runtimes.
 */
export interface FeatureFlagResponse {
  key: string;
  enabled: boolean;
}
