import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider as JotaiProvider } from "jotai";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <JotaiProvider>
      <App />
    </JotaiProvider>
  </React.StrictMode>
);
