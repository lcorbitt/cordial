import { serveWithPermission } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveWithPermission(
  handle,
  {
    name: "get-admin-overview",
    limit: 30,
    windowSeconds: 60,
  },
  "audit:read",
);
