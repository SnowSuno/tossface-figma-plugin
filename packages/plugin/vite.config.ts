import { defineConfig } from "vite";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteSingleFile } from "vite-plugin-singlefile";
import generateFile from "vite-plugin-generate-file";

import base from "../../vite.config.base";

export default defineConfig(({ mode }) => {
  let injectGlobals: { __html__?: string } = {};

  if (mode === "dev") {
    // Use local vite dev server to serve UI to enable HMR
    base.manifest.ui = undefined;
    base.manifest.networkAccess.devAllowedDomains = [
      `http://localhost:${base.port}`,
    ];

    injectGlobals.__html__ = JSON.stringify(
      `<script>window.location.href = "http://localhost:${base.port}/ui"</script>`,
    );
  }

  return {
    plugins: [
      generateFile({
        type: "json",
        output: "./manifest.json",
        data: base.manifest,
      }),
      tsconfigPaths(),
      viteSingleFile(),
    ],
    build: {
      outDir: path.resolve("../../dist"),
      rollupOptions: {
        input: path.resolve("./src/code.ts"),
        output: {
          entryFileNames: "code.js",
        },
      },
      emptyOutDir: false,
    },
    define: injectGlobals,
  };
});
