
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    compression({ algorithm: "brotliCompress" }), // Enable GZIP compression
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'journeylog',
        short_name: 'journeylog',
        description: 'A Vite-based Progressive Web App',
        theme_color: '#ffffff',
        background_color: "#080d1f",
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,scss,jsx,png,svg,ico}'], // Fixed syntax
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // Increased cache size limit to 6MB
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 3000, // Set a higher limit to suppress chunk warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Moves dependencies into a separate chunk
          }
          if (id.includes("TravelRoute")) {
            return "travel-route"; // Moves TravelRoute into its own chunk
          }
        },
      },
    },
  },
});
