import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import compileTime from "vite-plugin-compile-time";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

import base from "../../vite.config.base";

export default defineConfig({
  plugins: [
    compileTime(),
    react(),
    vanillaExtractPlugin(),
    tsconfigPaths(),
    viteSingleFile(),
  ],
  build: {
    outDir: base.outDir,
    rollupOptions: {
      input: path.resolve("ui.html"),
    },
    cssCodeSplit: false,
    emptyOutDir: false,
  },
  server: {
    port: base.port,
  },
  define: {
    __PLUGIN_ID__: base.manifest.id,
  },
});
