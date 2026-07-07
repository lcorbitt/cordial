import { describe, expect, it } from "vitest";

import { coerceBlankEnv } from "@/lib/env/coerce";
import { parseServerEnv } from "@/lib/env/server-schema";

describe("coerceBlankEnv", () => {
  it("turns blank strings into undefined", () => {
    expect(
      coerceBlankEnv({
        SENTRY_DSN: "",
        INNGEST_SIGNING_KEY: "   ",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54521",
      }),
    ).toEqual({
      SENTRY_DSN: undefined,
      INNGEST_SIGNING_KEY: undefined,
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54521",
    });
  });
});

describe("parseServerEnv", () => {
  const baseEnv = {
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54521",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
  };

  it("requires INNGEST_SIGNING_KEY in production", () => {
    const result = parseServerEnv({
      ...baseEnv,
      APP_ENV: "production",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["INNGEST_SIGNING_KEY"]);
    }
  });

  it("accepts production when INNGEST_SIGNING_KEY is set", () => {
    const result = parseServerEnv({
      ...baseEnv,
      APP_ENV: "production",
      INNGEST_SIGNING_KEY: "signing-key",
    });

    expect(result.success).toBe(true);
  });

  it("allows missing INNGEST_SIGNING_KEY in production during next build", () => {
    const result = parseServerEnv(
      {
        ...baseEnv,
        APP_ENV: "production",
      },
      { skipProductionRuntimeChecks: true },
    );

    expect(result.success).toBe(true);
  });
});
