import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist-extension',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'popup.html'),
        main: path.resolve(__dirname, 'index.html')
      },
    },
  },
  define: {
    global: 'globalThis',
  },
}));