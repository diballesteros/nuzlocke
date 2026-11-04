import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'dev-dist/',
      'coverage/',
      '.nyc_output/',
      'test-results/',
      'playwright-report/',
      'verification/artifacts/',
      '.lighthouseci/',
      'verification/.session/',
      // Claude Code's per-session git worktrees: whole other checkouts
      '.claude/worktrees/',
      'src/constants/locations/*',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  // {
  //   files: ['**/*.ts', '**/*.tsx'],
  //   extends: [tseslint.configs.recommendedTypeChecked, tseslint.configs.stylisticTypeChecked],
  //   languageOptions: {
  //     ecmaVersion: '2022',
  //     sourceType: 'module',
  //     globals: {
  //       ...globals.node,
  //       ...globals.browser,
  //     },
  //     parserOptions: {
  //       projectService: true,
  //       tsconfigRootDir: import.meta.dirname,
  //     },
  //   },
  // },
  // Separate objects: spreading both presets into one let the hooks preset overwrite the
  // React preset's plugins and rules, so no react/* rules ran
  {
    files: ['**/*.jsx', '**/*.tsx'],
    ...reactPlugin.configs.flat.recommended,
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
    },
    settings: {
      react: {
        version: '19.3.1',
      },
    },
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    ...reactHooksPlugin.configs.flat['recommended-latest'],
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{ts,mjs}'],
    languageOptions: { globals: globals.node },
  },
  // Lighthouse CI only loads CommonJS config
  {
    files: ['lighthouserc.cjs'],
    languageOptions: { globals: { ...globals.node, ...globals.commonjs } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  // Node scripts whose page.evaluate callbacks run in the browser
  {
    files: ['.claude/skills/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  // Playwright fixtures must destructure their first argument, even when they use none of it
  {
    files: ['tests/**/*.ts'],
    rules: { 'no-empty-pattern': 'off' },
  },
  {
    rules: {
      'no-console': ['warn', { 'allow': ['warn', 'error', 'info'] }],
      'sort-imports': ['error', { 'ignoreCase': true, 'ignoreDeclarationSort': true }],
    },
  }
);
