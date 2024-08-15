export interface FigmaManifest {
  name: string;
  id: string;
  api: string;
  main: string;
  ui?: string;
  editorType: ("figma" | "figjam" | "dev")[];
  networkAccess: {
    allowedDomains?: string[];
    devAllowedDomains?: string[];
  };
}

export const defineManifest = (manifest: FigmaManifest) => manifest;
