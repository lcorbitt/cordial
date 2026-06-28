import { serveWithPermission } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveWithPermission(
  handle,
  {
    name: "send-community-invite",
    limit: 10,
    windowSeconds: 60,
  },
  "communities:manage",
);
