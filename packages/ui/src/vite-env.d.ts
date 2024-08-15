/// <reference types="vite/client" />

declare interface ImportMeta {
  compileTime: <T>(file: string) => T;
}

declare const __PLUGIN_ID__: string;
