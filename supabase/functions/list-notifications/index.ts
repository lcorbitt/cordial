import { serveAuthenticated } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveAuthenticated(handle, {
  name: "list-notifications",
  limit: 120,
  windowSeconds: 60,
});
