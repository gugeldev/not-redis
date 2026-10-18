import { restoreAof } from "./src/replay";
import { initServer } from "./src/server";

const port = Number(process.env.PORT ?? 7777);
const persistence = process.env.AOF === "true";

if (persistence) await restoreAof();

initServer(port, persistence);
