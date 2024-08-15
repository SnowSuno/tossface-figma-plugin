import { defineConfig } from "vite";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteSingleFile } from "vite-plugin-singlefile";
import generateFile from "vite-plugin-generate-file";

import { manifest } from "./figma.manifest";

export default defineConfig(({ mode }) => {
  let define: { __html__?: string } = {};

  if (mode === "dev") {
    // Use local vite dev server to serve UI to enable HMR
    const devPort = 5173;

    manifest.ui = undefined;
    manifest.networkAccess.devAllowedDomains = [`http://localhost:${devPort}`];

    define.__html__ = JSON.stringify(
      `<script>window.location.href = "http://localhost:${devPort}/ui"</script>`,
    );
  }

  return {
    plugins: [
      generateFile({
        type: "json",
        output: "./manifest.json",
        data: manifest,
      }),
      tsconfigPaths(),
      viteSingleFile(),
    ],
    build: {
      outDir: path.resolve("dist"),
      rollupOptions: {
        input: path.resolve("./main/code.ts"),
        output: {
          entryFileNames: "code.js",
        },
      },
      emptyOutDir: false,
    },
    define,
  };
});
