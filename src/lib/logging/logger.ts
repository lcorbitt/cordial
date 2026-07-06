import "server-only";

import pino, { type Logger } from "pino";

import { env } from "@/lib/env/server";

/**
 * Structured logger. Emits JSON in deployed environments (ingestible by log
 * platforms) and pretty output locally. Logs must never contain secrets, raw
 * passwords, or full tokens (OWASP A09: Security Logging and Alerting).
 */
const isLocal = env.APP_ENV === "local";

export const logger: Logger = pino({
  level: isLocal ? "debug" : "info",
  base: { app: "cordial", env: env.APP_ENV },
  redact: {
    paths: [
      "password",
      "*.password",
      "token",
      "*.token",
      "authorization",
      "*.authorization",
      "cookie",
      "*.cookie",
    ],
    censor: "[redacted]",
  },
  ...(isLocal
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "HH:MM:ss" },
        },
      }
    : {}),
});

/**
 * Create a child logger bound to request/user context for correlation across a
 * single request lifecycle.
 */
export function createRequestLogger(context: {
  requestId?: string;
  userId?: string;
  route?: string;
}): Logger {
  return logger.child(context);
}
