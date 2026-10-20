import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginCypress from 'eslint-plugin-cypress';
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
      'cypress/downloads/',
      'src/constants/locations/*',
      'supabase/*',
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
  {
    files: ['**/*.jsx', '**/*.tsx'],
    ...reactPlugin.configs.flat.recommended,
    ...reactHooksPlugin.configs['recommended-latest'],
    settings: {
      react: {
        version: '18.3.1',
      },
    },
  },
  {
    files: ['cypress/**/*.ts', 'cypress/**/*.js', '**/*.cy.ts', '**/*.cy.js'],
    ...pluginCypress.configs.recommended,
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{ts,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      'no-console': ['warn', { 'allow': ['warn', 'error', 'info'] }],
      'sort-imports': ['error', { 'ignoreCase': true, 'ignoreDeclarationSort': true }],
    },
  }
);
