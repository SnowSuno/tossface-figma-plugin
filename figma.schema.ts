/**
 * Manually created from official docs.
 * @see https://www.figma.com/plugin-docs/manifest/
 */
export interface FigmaManifest {
  name: string;
  id: string;
  api: string;
  main: string;
  ui?: string | { [key: string]: string };
  editorType: ("figma" | "figjam" | "dev")[];
  documentAccess?: "dynamic-page";
  networkAccess?: NetworkAccess;
}

interface NetworkAccess {
  allowedDomains: string[];
  reasoning?: string;
  devAllowedDomains?: string[];
}

export const defineManifest = (manifest: FigmaManifest) => manifest;
