import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginCypress from 'eslint-plugin-cypress';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
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
    ignores: ['src/constants/locations/*', 'supabase/*'],
    rules: {
      'no-console': ['warn', { 'allow': ['warn', 'error', 'info'] }],
      'sort-imports': ['error', { 'ignoreCase': true, 'ignoreDeclarationSort': true }],
    },
  }
);
