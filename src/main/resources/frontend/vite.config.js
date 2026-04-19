import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite has built-in Hot Module Replacement (HMR).
// When you save a file, the browser auto-updates without a full reload.
// No extra plugin is needed — this is the "auto reload" you asked for.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    // Proxy /api requests to the Spring Boot backend to avoid CORS headaches in dev.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/data-api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
