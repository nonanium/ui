import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NonaniumSettingsProvider } from "@nonanium/ui";

import App from "./App";
import { ThemeStoreProvider } from "./ThemeStore";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NonaniumSettingsProvider storage={localStorage}>
      <ThemeStoreProvider>
        <App />
      </ThemeStoreProvider>
    </NonaniumSettingsProvider>
  </StrictMode>,
);
