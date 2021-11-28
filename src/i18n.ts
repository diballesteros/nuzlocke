import i18n, { Module } from 'i18next';
import { initReactI18next } from 'react-i18next';
import ABOUT_DE from 'locale/de/about.json';
import BADGES_DE from 'locale/de/badges.json';
import BUILDER_DE from 'locale/de/builder.json';
import CALCULATOR_DE from 'locale/de/calculator.json';
import COMMON_DE from 'locale/de/common.json';
import IMPORT_DE from 'locale/de/import.json';
import REPORT_DE from 'locale/de/report.json';
import RULES_DE from 'locale/de/rules.json';
import SETTINGS_DE from 'locale/de/settings.json';
import STATS_DE from 'locale/de/stats.json';
import TRACKER_DE from 'locale/de/tracker.json';
import ABOUT_EN from 'locale/en/about.json';
import BADGES_EN from 'locale/en/badges.json';
import BUILDER_EN from 'locale/en/builder.json';
import CALCULATOR_EN from 'locale/en/calculator.json';
import COMMON_EN from 'locale/en/common.json';
import IMPORT_EN from 'locale/en/import.json';
import REPORT_EN from 'locale/en/report.json';
import RULES_EN from 'locale/en/rules.json';
import SETTINGS_EN from 'locale/en/settings.json';
import STATS_EN from 'locale/en/stats.json';
import TRACKER_EN from 'locale/en/tracker.json';
import ABOUT_ES from 'locale/es/about.json';
import BADGES_ES from 'locale/es/badges.json';
import BUILDER_ES from 'locale/es/builder.json';
import CALCULATOR_ES from 'locale/es/calculator.json';
import COMMON_ES from 'locale/es/common.json';
import IMPORT_ES from 'locale/es/import.json';
import REPORT_ES from 'locale/es/report.json';
import RULES_ES from 'locale/es/rules.json';
import SETTINGS_ES from 'locale/es/settings.json';
import STATS_ES from 'locale/es/stats.json';
import TRACKER_ES from 'locale/es/tracker.json';
import store from 'store';

const resources = {
  de: {
    about: ABOUT_DE,
    badges: BADGES_DE,
    builder: BUILDER_DE,
    calculator: CALCULATOR_DE,
    common: COMMON_DE,
    import: IMPORT_DE,
    report: REPORT_DE,
    rules: RULES_DE,
    settings: SETTINGS_DE,
    stats: STATS_DE,
    tracker: TRACKER_DE,
  },
  en: {
    about: ABOUT_EN,
    badges: BADGES_EN,
    builder: BUILDER_EN,
    calculator: CALCULATOR_EN,
    common: COMMON_EN,
    import: IMPORT_EN,
    report: REPORT_EN,
    rules: RULES_EN,
    settings: SETTINGS_EN,
    stats: STATS_EN,
    tracker: TRACKER_EN,
  },
  es: {
    about: ABOUT_ES,
    badges: BADGES_ES,
    builder: BUILDER_ES,
    calculator: CALCULATOR_ES,
    common: COMMON_ES,
    import: IMPORT_ES,
    report: REPORT_ES,
    rules: RULES_ES,
    settings: SETTINGS_ES,
    stats: STATS_ES,
    tracker: TRACKER_ES,
  },
};

const NOTHING = () => {
  // do nothing
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lng: string) => void) => {
    const lang = store.getState().language;
    callback(lang);
    return lang;
  },
  init: NOTHING,
  cacheUserLanguage: NOTHING,
};

i18n
  .use(initReactI18next)
  .use(languageDetector as Module)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
