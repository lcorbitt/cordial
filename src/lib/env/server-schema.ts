import { z } from "zod";

import { coerceBlankEnv } from "./coerce";

export type ParseServerEnvOptions = {
  /** Skip runtime-only production checks during `next build`. */
  skipProductionRuntimeChecks?: boolean;
};

/**
 * Server environment schema. Shared with tests via parseServerEnv — keep in sync
 * with src/lib/env/server.ts.
 */
export const serverEnvSchema = z.object({
  APP_ENV: z
    .enum(["local", "development", "staging", "production"])
    .default("local"),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Upstash Redis (CacheProvider default)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Email (EmailProvider)
  EMAIL_PROVIDER: z.enum(["resend"]).default("resend"),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().default("Cordial <onboarding@resend.dev>"),

  // Jobs (JobProvider)
  JOB_PROVIDER: z.enum(["inngest"]).default("inngest"),
  INNGEST_EVENT_KEY: z.string().min(1).optional(),
  INNGEST_SIGNING_KEY: z.string().min(1).optional(),

  // Analytics (AnalyticsProvider)
  ANALYTICS_PROVIDER: z.enum(["posthog", "none"]).default("none"),
  POSTHOG_API_KEY: z.string().min(1).optional(),
  POSTHOG_HOST: z.string().url().default("https://us.i.posthog.com"),

  // Monitoring (MonitoringProvider)
  SENTRY_DSN: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function productionRuntimeIssues(
  env: ServerEnv,
  skipProductionRuntimeChecks: boolean,
): z.ZodIssue[] {
  if (skipProductionRuntimeChecks || env.APP_ENV !== "production") {
    return [];
  }

  const issues: z.ZodIssue[] = [];

  if (!env.INNGEST_SIGNING_KEY) {
    issues.push({
      code: "custom",
      message: "INNGEST_SIGNING_KEY is required in production",
      path: ["INNGEST_SIGNING_KEY"],
    });
  }

  return issues;
}

export function parseServerEnv(
  source: Record<string, string | undefined> = process.env,
  options: ParseServerEnvOptions = {},
) {
  const parsed = serverEnvSchema.safeParse(coerceBlankEnv(source));
  if (!parsed.success) {
    return parsed;
  }

  const runtimeIssues = productionRuntimeIssues(
    parsed.data,
    options.skipProductionRuntimeChecks ?? false,
  );

  if (runtimeIssues.length === 0) {
    return parsed;
  }

  return {
    success: false as const,
    error: new z.ZodError(runtimeIssues),
  };
}
