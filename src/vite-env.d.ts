/// <reference types="vite/client" />

declare interface ImportMeta {
  compileTime: <T>(file: string) => T;
}
