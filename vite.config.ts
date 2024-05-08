/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    setupFiles: ["src/vitest.setup.ts"],
    environment: "jsdom",
    exclude: ["node_modules"],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      include: ["src/**/*"],
    },
  },
  plugins: [
    react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
