import { serveAuthenticated } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveAuthenticated(handle, {
  name: "get-community",
  limit: 60,
  windowSeconds: 60,
});
