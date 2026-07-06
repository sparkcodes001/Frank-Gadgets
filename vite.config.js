// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // ✅ Must be a FUNCTION in Vite 8 / rolldown
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react-router")) {
              return "react-vendor";
            }
            if (id.includes("gsap")) {
              return "gsap";
            }
            if (
              id.includes("recharts") ||
              id.includes("react-is") ||
              id.includes("d3")
            ) {
              return "charts";
            }
            if (id.includes("@react-three") || id.includes("three")) {
              return "three";
            }
            // Everything else in node_modules goes to vendor
            return "vendor";
          }
        },
      },
    },
  },
});
