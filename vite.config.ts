/// <reference types="vitest/config" />
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Nuzlocke Tracker',
        short_name: 'Nuzlocke',
        description: 'Pokemon Nuzlocke Challenge Tracker',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    sentryVitePlugin({
      org: 'relatable-code',
      project: 'react',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, './src/components'),
      'constants': path.resolve(__dirname, './src/constants'),
      'common': path.resolve(__dirname, './src/common'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'selectors': path.resolve(__dirname, './src/selectors'),
      'store': path.resolve(__dirname, './src/store.ts'),
      'assets': path.resolve(__dirname, './src/assets'),
      'locale': path.resolve(__dirname, './src/locale'),
      'error': path.resolve(__dirname, './src/error'),
      'routes': path.resolve(__dirname, './src/routes'),
      'supabaseClient': path.resolve(__dirname, './src/supabaseClient.ts'),
    },
  },

  define: {
    // Replace process.env with import.meta.env
    'process.env': {},
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles" as *;`,
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
  },

  envPrefix: 'REACT_APP_',

  build: {
    sourcemap: true,
  },
});
