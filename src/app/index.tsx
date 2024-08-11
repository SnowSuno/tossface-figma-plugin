import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { OverlayProvider } from "@toss/use-overlay";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

import "./style.css";

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
