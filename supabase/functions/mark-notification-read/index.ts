import { serveAuthenticated } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveAuthenticated(handle, {
  name: "mark-notification-read",
  limit: 60,
  windowSeconds: 60,
});
