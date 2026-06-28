import { serveAuthenticated } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveAuthenticated(handle, {
  name: "create-avatar-upload-url",
  limit: 30,
  windowSeconds: 60,
});
