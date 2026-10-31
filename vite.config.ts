/// <reference types="vitest/config" />
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import istanbul from 'vite-plugin-istanbul';
import svgr from 'vite-plugin-svgr';
import { execFileSync } from 'child_process';
import path from 'path';
import type { Plugin } from 'vite';
import { buildSitemap } from './src/routes/sitemap';

// Tests and static data tables are left out of coverage. Shared by Playwright (istanbul) and Vitest
const COVERAGE_EXCLUDE = [
  'src/**/*.test.{ts,tsx}',
  'netlify/**/*.{test,fake}.ts',
  'src/setupTests.ts',
  'src/vite-env.d.ts',
  'src/constants/locations/**',
  'src/constants/{abilities,badges,changelog,changelog_2,details,filters,moves,nicknames,pokemon}.ts',
];

// Writes sitemap.xml into the build, dated by the commit being built (the build date without git)
function sitemap(): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      let lastmod = '';
      try {
        lastmod = execFileSync('git', ['log', '-1', '--format=%cs'], { encoding: 'utf8' }).trim();
      } catch {
        // No git in this build environment
      }
      lastmod ||= new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(lastmod) });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    sitemap(),
    // Instruments src only when REACT_APP_COVERAGE=true (npm run dev:cov, the Playwright web server).
    // The plugin reads <envPrefix>COVERAGE, hence the REACT_APP_ prefix
    istanbul({
      include: 'src/**/*.{ts,tsx}',
      exclude: ['node_modules', ...COVERAGE_EXCLUDE],
      extension: ['.ts', '.tsx'],
      requireEnv: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // The share preview is for crawlers (index.html's og:image), not the offline app
        globIgnores: ['**/node_modules/**/*', 'og-image.png'],
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
    },
  },

  define: {
    // Replace process.env with import.meta.env
    'process.env': {},
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'netlify/**/*.test.ts'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx}', 'netlify/**/*.ts'],
      exclude: COVERAGE_EXCLUDE,
      reporter: ['json', 'json-summary', 'text-summary'],
      reportsDirectory: 'coverage/unit',
    },
  },

  envPrefix: 'REACT_APP_',

  server: {
    port: 3000,
    // Without HMR, plugin-react skips Fast Refresh code so e2e coverage lines up with Vitest's
    ...(process.env.REACT_APP_COVERAGE === 'true' && { hmr: false }),
  },

  build: {
    sourcemap: true,
    // Lightning CSS (Vite 8's default) rounds numbers to about six significant digits, so the
    // calibrated values (1.28571429em…) moved boxes by 1/64px in production. esbuild keeps them
    cssMinify: 'esbuild',
  },
});
