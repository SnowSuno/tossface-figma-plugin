/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

declare interface ImportMeta {
  compileTime: <T>(file: string) => T;
}

declare const __PLUGIN_ID__: string;
