/**
 * Wire contract for the get-health endpoint. Pure types only so this file can
 * be imported by both the Deno backend (@shared/dto/health.dto.ts) and the
 * Next.js frontend (@shared/dto/health.dto).
 */
export interface HealthResponse {
  status: "ok" | "degraded";
  checks: {
    database: boolean;
    redis: boolean;
  };
  timestamp: string;
}
