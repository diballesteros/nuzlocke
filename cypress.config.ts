/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    specPattern: 'cypress/e2e/**/*.spec.ts',
  },
});
