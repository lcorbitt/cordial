import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint enforces the architectural boundaries from AGENTS.md:
 *  - No Server Actions ('use server')
 *  - Use @tanstack/react-query, never the legacy react-query package
 *  - Frontend services and TanStack hook files must stay free of cross-layer leaks
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // No Server Actions anywhere in the codebase.
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExpressionStatement > Literal[value='use server']",
          message:
            "Server Actions are not allowed. Use a Supabase Edge Function (handler -> service -> model) instead.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-query",
              message: "Use @tanstack/react-query instead of react-query.",
            },
          ],
        },
      ],
    },
  },

  // Frontend services are plain fetch adapters: no React, no TanStack.
  {
    files: ["src/frontend/services/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              message: "Frontend services must not import React.",
            },
            {
              name: "@tanstack/react-query",
              message:
                "Frontend services must not depend on TanStack Query. Hooks call services, not the other way around.",
            },
          ],
        },
      ],
    },
  },

  // Edge Functions are linted by `deno lint` (`npm run lint:edge`), not Node ESLint.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "supabase/functions/**",
    "coverage/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
