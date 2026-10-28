import { act, renderHook } from '@testing-library/react';
import NATURES from 'constants/natures';
import { useNatureName, useNatureOptions } from 'hooks/useNatures';
import i18n from '../i18n';

describe('useNatures', () => {
  afterEach(async () => {
    await act(() => i18n.changeLanguage('en'));
  });

  test('labels natures in English by default, keeping the English value', async () => {
    await act(() => i18n.changeLanguage('en'));
    const { result } = renderHook(() => useNatureOptions());
    expect(result.current.map((option) => option.text)).toEqual(
      NATURES.map((nature) => nature.text)
    );
    expect(result.current.map((option) => option.value)).toEqual(
      NATURES.map((nature) => nature.value)
    );
  });

  test('uses the official game names in German and Spanish', async () => {
    const options = renderHook(() => useNatureOptions());
    const name = renderHook(() => useNatureName());

    await act(() => i18n.changeLanguage('de'));
    expect(options.result.current.find((option) => option.value === 'Adamant')).toEqual({
      keywords: ['Adamant'],
      text: 'Hart',
      value: 'Adamant',
    });
    expect(name.result.current('Bold')).toBe('Kühn');

    await act(() => i18n.changeLanguage('es'));
    expect(options.result.current.find((option) => option.value === 'Adamant')?.text).toBe('Firme');
    expect(name.result.current('Bold')).toBe('Osada');
  });

  test('every nature has a German and Spanish name', () => {
    for (const language of ['de', 'es']) {
      for (const { value } of NATURES) {
        expect(i18n.exists(`natures.${value}`, { ns: 'common', lng: language })).toBe(true);
      }
    }
  });

  test('shows an unknown nature as stored', async () => {
    await act(() => i18n.changeLanguage('de'));
    const { result } = renderHook(() => useNatureName());
    expect(result.current('None')).toBe('None');
  });
});
