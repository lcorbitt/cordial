import { serveWithPermission } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveWithPermission(
  handle,
  {
    name: "list-admin-community-members",
    limit: 60,
    windowSeconds: 60,
  },
  "communities:read",
);
