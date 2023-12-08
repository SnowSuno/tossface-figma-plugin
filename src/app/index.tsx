import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { OverlayProvider } from "@toss/use-overlay";

import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("react-page");
  const root = createRoot(container!);
  root.render(
    <OverlayProvider>
      <App />
    </OverlayProvider>,
  );
});
