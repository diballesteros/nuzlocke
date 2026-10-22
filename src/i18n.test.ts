import { INITIAL_STATE } from 'constants/constant';

describe('i18n', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  test('starts in the language saved in the store', async () => {
    const state = { ...structuredClone(INITIAL_STATE), language: 'es' };
    localStorage.setItem('pokemon-tracker', JSON.stringify({ state, version: 8 }));
    const { default: i18n } = await import('./i18n');
    await vi.waitFor(() => expect(i18n.language).toBe('es'));
    expect(i18n.t('back', { ns: 'common' })).toBe('Atrás');
  });

  test('falls back to English for missing keys', async () => {
    const { default: i18n } = await import('./i18n');
    // Every real key is translated (see localeKeys in data.test.ts), so add one only to English
    i18n.addResource('en', 'common', 'fallback_probe', 'English only');
    await i18n.changeLanguage('de');
    expect(i18n.t('fallback_probe', { ns: 'common' })).toBe('English only');
  });

  test('loads encounter-template translations', async () => {
    const { default: i18n } = await import('./i18n');
    await i18n.changeLanguage('de');
    expect(i18n.t('encounter_template', { ns: 'common' })).toBe('Begegnungsvorlage');

    await i18n.changeLanguage('es');
    expect(i18n.t('encounter_template', { ns: 'common' })).toBe('Plantilla de encuentros');
  });

  test('interpolates and pluralises', async () => {
    const { default: i18n } = await import('./i18n');
    await i18n.changeLanguage('en');
    expect(i18n.t('already_exists', { ns: 'rules', rule: 'Dupes' })).toBe(
      'Dupes rule already exists'
    );
    expect(i18n.t('add_encounter', { ns: 'tracker', count: 1 })).toBe('Add Encounter');
    expect(i18n.t('add_encounter', { ns: 'tracker', count: 2 })).toBe('Add Encounters');
  });
});
