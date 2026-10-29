import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AppState, TCalculatorForm } from 'constants/types';
import useStore from 'store';
import Calculator from './Calculator';

const INITIAL = useStore.getState();
const SWSH = '13';

const store = () => useStore.getState();
const form = (): TCalculatorForm => store().calcs[store().selectedGame.value].form;

// Radix measures the anchor; jsdom has no ResizeObserver or pointer capture
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

beforeEach(() => {
  useStore.setState({ ...INITIAL, ...structuredClone(stripActions(INITIAL)) }, true);
  localStorage.clear();
  store().selectGame(store().gamesList.find((game) => game.value === SWSH));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function stripActions(state: AppState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  ) as Partial<AppState>;
}

describe('Calculator', () => {
  test('without a game it asks for one', () => {
    store().selectGame(null);
    render(<Calculator />);
    expect(screen.getByText('please_select')).toBeTruthy();
  });

  test('on a narrow screen, Enter or Space on a tab shows that side; other keys do not', () => {
    vi.stubGlobal('innerWidth', 500);
    const { container } = render(<Calculator />);
    const [side1, side2] = Array.from(container.querySelectorAll<HTMLElement>('form > fieldset'));
    expect([side1.style.display, side2.style.display]).toEqual(['flex', 'none']);

    fireEvent.keyDown(screen.getByTestId('pokemon2-tab'), { key: 'a' });
    expect(side2.style.display).toBe('none');
    fireEvent.keyDown(screen.getByTestId('pokemon2-tab'), { key: 'Enter' });
    expect([side1.style.display, side2.style.display]).toEqual(['none', 'flex']);
    fireEvent.keyDown(screen.getByTestId('pokemon1-tab'), { key: ' ' });
    expect([side1.style.display, side2.style.display]).toEqual(['flex', 'none']);
  });

  test('the level stays between 0 and 100', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    store().updateDefaultValues({ level1: 100, level2: 0 });
    await user.click(screen.getByTestId('plus-level1'));
    await user.click(screen.getByTestId('minus-level2'));
    expect([form().level1, form().level2]).toEqual([100, 0]);

    await user.click(screen.getByTestId('minus-level1'));
    await user.click(screen.getByTestId('plus-level2'));
    expect([form().level1, form().level2]).toEqual([99, 1]);
  });

  test('a stat modifier stays between -6 and +6', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    store().updateDefaultValues({ modatk1: 6, moddef1: -6 });
    await user.click(screen.getByTestId('plus-modatk1'));
    await user.click(screen.getByTestId('minus-moddef1'));
    expect([form().modatk1, form().moddef1]).toEqual([6, -6]);

    await user.click(screen.getByTestId('minus-modatk1'));
    await user.click(screen.getByTestId('plus-moddef1'));
    expect([form().modatk1, form().moddef1]).toEqual([5, -5]);
    expect(screen.getByTestId('modatk1').textContent).toBe('5');
  });

  test('Enter or Space expands the results and pins one; other keys do nothing', async () => {
    render(<Calculator />);
    const expand = screen.getByTestId('expand-moves');
    fireEvent.keyDown(expand, { key: 'Tab' });
    expect(expand.getAttribute('aria-expanded')).toBe('false');
    fireEvent.keyDown(expand, { key: 'Enter' });
    expect(expand.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(expand, { key: ' ' });
    expect(expand.getAttribute('aria-expanded')).toBe('false');

    const pinned = () =>
      screen
        .getAllByRole('button')
        .filter((el) => /-result-/.test(el.dataset.testid ?? ''))
        .find((el) => el.className.includes('font-bold'))?.dataset.testid;
    const before = pinned();
    fireEvent.keyDown(screen.getByTestId('defender-result-2'), { key: 'x' });
    expect(pinned()).toBe(before);
    fireEvent.keyDown(screen.getByTestId('defender-result-2'), { key: 'Enter' });
    expect(pinned()).toBe('defender-result-2');
    fireEvent.keyDown(screen.getByTestId('attacker-result-3'), { key: ' ' });
    expect(pinned()).toBe('attacker-result-3');
  });

  test('a side without a status shows the placeholder', () => {
    render(<Calculator />);
    const field = () => screen.getByTestId('status2');
    expect(field().textContent).toBe('Healthy');
    act(() => store().updateDefaultValues({ status2: undefined }));
    expect(field().textContent).toBe('select_status');
    expect((within(field()).getByRole('combobox') as HTMLInputElement).value).toBe('');
  });
});
