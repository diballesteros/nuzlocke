/// <reference types="vitest/config" />
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import istanbul from 'vite-plugin-istanbul';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// Tests and static data tables are left out of coverage. Shared by Cypress (istanbul) and Vitest
const COVERAGE_EXCLUDE = [
  'src/**/*.test.{ts,tsx}',
  'src/setupTests.ts',
  'src/vite-env.d.ts',
  // Auth (Supabase) is planned for removal, so it is not tested
  'src/components/Auth/**',
  'src/supabaseClient.ts',
  'src/constants/locations/**',
  'src/constants/{abilities,badges,changelog,changelog_2,details,filters,moves,nicknames,pokemon}.ts',
];

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // Instruments src only when CYPRESS_COVERAGE=true (npm run dev:cov), for Cypress coverage
    istanbul({
      include: 'src/**/*.{ts,tsx}',
      exclude: ['node_modules', ...COVERAGE_EXCLUDE],
      extension: ['.ts', '.tsx'],
      requireEnv: true,
      cypress: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB limit
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
      '@': path.resolve(import.meta.dirname, 'src'),
      'components': path.resolve(import.meta.dirname, './src/components'),
      'constants': path.resolve(import.meta.dirname, './src/constants'),
      'common': path.resolve(import.meta.dirname, './src/common'),
      'hooks': path.resolve(import.meta.dirname, './src/hooks'),
      'selectors': path.resolve(import.meta.dirname, './src/selectors'),
      'store': path.resolve(import.meta.dirname, './src/store.ts'),
      'assets': path.resolve(import.meta.dirname, './src/assets'),
      'locale': path.resolve(import.meta.dirname, './src/locale'),
      'error': path.resolve(import.meta.dirname, './src/error'),
      'routes': path.resolve(import.meta.dirname, './src/routes'),
      'supabaseClient': path.resolve(import.meta.dirname, './src/supabaseClient.ts'),
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
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx}'],
      exclude: COVERAGE_EXCLUDE,
      reporter: ['json', 'json-summary', 'text-summary'],
      reportsDirectory: 'coverage/unit',
    },
  },

  envPrefix: 'REACT_APP_',

  // Components are default-imported from semantic-ui-react/dist/commonjs/* in ~56 files, which
  // Vite 8's stricter CJS interop resolves to the module object. Remove with Semantic UI
  legacy: {
    inconsistentCjsInterop: true,
  },

  server: {
    port: 3000,
    // Without HMR, plugin-react skips Fast Refresh code so e2e coverage lines up with Vitest's
    ...(process.env.CYPRESS_COVERAGE === 'true' && { hmr: false }),
  },

  build: {
    sourcemap: true,
    // Vite 7's default targets; Vite 8 raised them (Chrome 111, Safari 16.4), dropping older browsers
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    // Lightning CSS (Vite 8 default) rejects an invalid selector in semantic-ui-css
    // ("[data-tooltip][data-inverted]:after .header"). Revisit once Semantic UI is gone
    cssMinify: 'esbuild',
  },
});
