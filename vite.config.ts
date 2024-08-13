import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), viteSingleFile()],
  build: {
    outDir: path.resolve("dist"),
    rollupOptions: {
      input: path.resolve("ui.html"),
    },
    cssCodeSplit: false,
    emptyOutDir: false,
  },
});
