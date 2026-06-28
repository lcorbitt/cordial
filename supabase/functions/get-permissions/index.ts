import { serveWithAccessContext } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

serveWithAccessContext(handle, {
  name: "get-permissions",
  limit: 60,
  windowSeconds: 60,
});
