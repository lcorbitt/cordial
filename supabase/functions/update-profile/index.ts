import { serveAuthenticated } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveAuthenticated(handle, {
  name: "update-profile",
  limit: 20,
  windowSeconds: 60,
});
