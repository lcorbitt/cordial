import { serveOptionalAuth } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveOptionalAuth(handle, {
  name: "get-feature-flag",
  limit: 120,
  windowSeconds: 60,
});
