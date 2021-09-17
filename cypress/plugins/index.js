/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('before:browser:launch', (browser, options) => {
    // only Firefox requires all mime types to be listed
    if (browser.family === 'firefox') {
      const downloadDirectory = process.cwd() + '\\cypress\\downloads';
      options.preferences['browser.download.dir'] = downloadDirectory;
      const existingMimeTypes = options.preferences['browser.helperApps.neverAsk.saveToDisk'];
      const myMimeType = 'my/mimetype';

      // prevents the browser download prompt
      options.preferences[
        'browser.helperApps.neverAsk.saveToDisk'
      ] = `${existingMimeTypes},${myMimeType}`;

      return options;
    }
  });
};
