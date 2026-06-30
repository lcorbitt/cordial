import { serveWithPermission } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveWithPermission(
  handle,
  {
    name: "list-admin-users",
    limit: 60,
    windowSeconds: 60,
  },
  "users:read",
);
