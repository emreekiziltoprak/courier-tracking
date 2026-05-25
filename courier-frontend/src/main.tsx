import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defineCustomElements } from "@esri/calcite-components/loader";
import "@esri/calcite-components/main.css";
import { App } from "./App";
import "./lib/agGrid";
import "./styles/main.scss";

defineCustomElements(window);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
