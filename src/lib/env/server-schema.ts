import { z } from "zod";

import { coerceBlankEnv } from "./coerce";

/**
 * Server environment schema. Shared with tests via parseServerEnv — keep in sync
 * with src/lib/env/server.ts.
 */
export const serverEnvSchema = z
  .object({
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
  })
  .refine((e) => e.APP_ENV !== "production" || Boolean(e.INNGEST_SIGNING_KEY), {
    message: "INNGEST_SIGNING_KEY is required in production",
    path: ["INNGEST_SIGNING_KEY"],
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(
  source: Record<string, string | undefined> = process.env,
) {
  return serverEnvSchema.safeParse(coerceBlankEnv(source));
}
