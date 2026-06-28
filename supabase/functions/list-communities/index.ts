import { serveAuthenticated } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveAuthenticated(handle, {
  name: "list-communities",
  limit: 60,
  windowSeconds: 60,
});
