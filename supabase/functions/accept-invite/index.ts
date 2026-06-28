import { serveAuthenticated } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveAuthenticated(handle, {
  name: "accept-invite",
  limit: 20,
  windowSeconds: 60,
});
