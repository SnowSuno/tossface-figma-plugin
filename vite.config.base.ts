import "vite";

import path from "node:path";
import manifest from "./figma.manifest";

export default {
  outDir: path.resolve("dist"),
  port: 5173,
  manifest,
};
