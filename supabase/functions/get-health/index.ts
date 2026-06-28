import { servePublic } from "@http/middleware/index.ts";
import { handle } from "./handler.ts";

servePublic(handle);
