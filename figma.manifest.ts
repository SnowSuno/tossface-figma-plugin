interface Manifest {
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

export const manifest: Manifest = {
  name: "Tossface",
  id: "1315040601403942607",
  api: "1.0.0",
  main: "code.js",
  ui: "ui.html",
  editorType: ["figma", "figjam"],
  networkAccess: {
    allowedDomains: [
      "https://cdn.jsdelivr.net",
      "https://spoqa.github.io",
      "https://raw.githubusercontent.com",
    ],
  },
};
