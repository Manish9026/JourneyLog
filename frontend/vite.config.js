// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // automatically updates the service worker
      manifest: {
        name: 'journeylog',
        short_name: 'journeylog',
        description: 'A Vite-based Progressive Web App',
        theme_color: '#ffffff',
        background_color:"#080d1f",
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src:'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        workbox: {
          globPatterns: ['**/*.{js,css,html,,scss,jsx,png,svg,ico}'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB limit
        }
      },
     
    })
  ],
  build: {
    // chunkSizeWarningLimit: 3000, // Set a higher limit (in KB)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Move dependencies to a separate chunk
          }
        },
      },
    },
  },
});
