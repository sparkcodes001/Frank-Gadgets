import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks to reduce bundle size
          react: ["react", "react-dom", "react-router-dom"],
          gsap: ["gsap"],
          recharts: ["recharts"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});