/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    clearMocks: true,
    restoreMocks: true,
    environment: "jsdom",
    exclude: ["node_modules"],
    setupFiles: ["src/test-setup.ts"],
    globals: true,
  },
  plugins: [
    react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("/src", import.meta.url)),
    },
  },
});
