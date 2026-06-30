/** Minimal Deno globals for unit tests that import Edge Function modules. */
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};
