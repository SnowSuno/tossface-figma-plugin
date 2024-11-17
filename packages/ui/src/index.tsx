import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { OverlayProvider } from "@toss/use-overlay";
import { QueryClientProvider } from "@tanstack/react-query";

import "./style.css";
import { queryClient } from "./query";
// import { emojiQueryManager } from "./emojiQueryManager";

// emojiQueryManager();

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("react-page");
  const root = createRoot(container!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <App />
      </OverlayProvider>
    </QueryClientProvider>,
  );
});
