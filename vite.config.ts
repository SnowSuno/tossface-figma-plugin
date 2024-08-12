import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    viteSingleFile({
      useRecommendedBuildConfig: false,
    }),
  ],
  build: {
    outDir: path.resolve("dist"),
    rollupOptions: {
      input: {
        code: path.resolve("src/plugin/controller.ts"),
        html: path.resolve("src/app/index.html"),
      },
      output: {
        inlineDynamicImports: false,
        manualChunks: undefined,
      },
    },
  },
});
