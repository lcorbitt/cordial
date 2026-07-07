import "server-only";

import { parseServerEnv, type ServerEnv } from "./server-schema";

export type { ServerEnv };
export { parseServerEnv };

function isNextBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function loadServerEnv(): ServerEnv {
  const parsed = parseServerEnv(process.env, {
    skipProductionRuntimeChecks: isNextBuildPhase(),
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid server environment variables:\n${issues}\n\n` +
        "Copy .env.example to .env.local and fill in the required values.",
    );
  }

  return parsed.data;
}

export const env = loadServerEnv();
