import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost", // For local dev, `localhost` is typically sufficient
    port: 8086,
  },
  plugins: [
    react(), // Vite plugin for React (SWC)
    mode === "development" && componentTagger(), // Only use `componentTagger` in development mode
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Path alias for `src`
    },
  },
  build: {
    // Add optimization for video files (in case Vite isn't processing them correctly)
    assetsInlineLimit: 4096, // Increase if needed for larger videos
  },
}));
