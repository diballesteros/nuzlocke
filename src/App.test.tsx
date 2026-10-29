import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import App from './App';
import type { AppState } from 'constants/types';
import useStore from 'store';

// The pages have their own tests; a stub shows where the app navigated to
vi.mock('routes/AppRouter', () => ({
  default: function Page() {
    return <output data-testid="page">{useLocation().pathname}</output>;
  },
}));

const INITIAL = useStore.getState();
const SWSH = '13';
const VERSION = import.meta.env.REACT_APP_VERSION;

const store = () => useStore.getState();
const prefersDark = vi.fn<(query: string) => { matches: boolean }>();

// Radix measures the anchor; jsdom has no ResizeObserver, pointer capture or matchMedia
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
  prefersDark.mockReset().mockReturnValue({ matches: false });
  vi.stubGlobal('matchMedia', prefersDark);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.classList.remove('dark');
});

function stripActions(state: AppState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  ) as Partial<AppState>;
}

function renderApp(path = '/') {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
  return user;
}

describe('theme', () => {
  test('the dark class on the root follows the store', () => {
    renderApp();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    act(() => store().toggleMode());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    act(() => store().toggleMode());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('a new version turns dark mode on when the system prefers it', () => {
    prefersDark.mockReturnValue({ matches: true });
    renderApp();
    expect(prefersDark).toHaveBeenCalledWith('(prefers-color-scheme:dark)');
    expect(store().darkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('a new version leaves the theme alone when the system prefers light', () => {
    renderApp();
    expect(prefersDark).toHaveBeenCalled();
    expect(store().darkMode).toBe(false);
  });

  test('the system theme is not read once the version has been seen', () => {
    prefersDark.mockReturnValue({ matches: true });
    useStore.setState({ newVersion: VERSION });
    renderApp();
    expect(prefersDark).not.toHaveBeenCalled();
    expect(store().darkMode).toBe(false);
  });

  // The optional chain is on window, not on matchMedia, so a browser without it would crash
  test('a new version throws without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    // React reports the error to window and the console as well; keep both quiet
    const quiet = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', quiet);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderApp()).toThrow('window?.matchMedia is not a function');
    window.removeEventListener('error', quiet);
    error.mockRestore();
  });
});

describe('new version notice', () => {
  test('flags the menu button and the Changelog item until the version is seen', async () => {
    const user = renderApp();
    const menu = screen.getByTestId('options');
    expect(menu.textContent).toBe('!');
    await user.click(menu);
    expect(screen.getByTestId('changelog').textContent).toContain('!');

    act(() => store().removeNew());
    expect(menu.textContent).toBe('');
    expect(screen.getByTestId('changelog').textContent).not.toContain('!');
  });
});

describe('sidebar', () => {
  test.each([
    ['tracker', '/'],
    ['rules', '/rules'],
    ['stats', '/stats'],
    ['builder', '/builder'],
    ['calculator', '/calculator'],
    ['settings', '/settings'],
    ['import', '/import'],
    ['report', '/report'],
    ['changelog', '/changelog'],
    ['about', '/about'],
  ])('%s navigates to %s and closes the sidebar', async (item, path) => {
    const user = renderApp('/somewhere');
    const menu = screen.getByTestId('options');
    await user.click(menu);
    expect(menu.getAttribute('aria-expanded')).toBe('true');

    await user.click(screen.getByTestId(item));
    expect(screen.getByTestId('page').textContent).toBe(path);
    expect(menu.getAttribute('aria-expanded')).toBe('false');
  });

  // Semantic's game dropdown kept its clicks from the sidebar
  test('stays open while the game select is used, and closes on other outside clicks', async () => {
    const user = renderApp();
    const menu = screen.getByTestId('options');
    await user.click(menu);
    await act(() => new Promise((resolve) => setTimeout(resolve)));

    await user.click(screen.getByTestId('game-select'));
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Escape}');

    await user.click(screen.getByTestId('page'));
    expect(menu.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('nav', () => {
  test('links the main pages and marks the current one', () => {
    renderApp('/builder');
    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/rules',
      '/stats',
      '/builder',
      '/calculator',
    ]);
    expect(screen.getByRole('link', { current: 'page' }).getAttribute('href')).toBe('/builder');
  });
});

describe('game select', () => {
  test('selects the chosen game', async () => {
    const user = renderApp();
    expect(store().selectedGame).toBeNull();
    await user.click(screen.getByRole('combobox', { name: 'games' }));
    const swsh = store().gamesList.find((game) => game.value === SWSH);
    await user.click(screen.getByRole('option', { name: swsh.text }));
    expect(store().selectedGame).toEqual(swsh);
  });
});

describe('delete custom game', () => {
  test('only custom games can be deleted', () => {
    useStore.setState({ selectedGame: store().gamesList.find((game) => game.value === SWSH) });
    renderApp();
    expect(screen.queryByRole('button', { name: 'deletegame' })).toBeNull();

    act(() => store().addGame('My run', null));
    expect(screen.getByRole('button', { name: 'deletegame' })).toBeTruthy();
  });

  test('cancel keeps the game, OK deletes it and says so', async () => {
    store().addGame('My run', null);
    const custom = store().selectedGame;
    expect(custom.value).toBe('14.1');
    const user = renderApp();

    await user.click(screen.getByRole('button', { name: 'deletegame' }));
    expect(screen.getByRole('dialog', { name: 'confirm_delete' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(store().selectedGame).toEqual(custom);

    await user.click(screen.getByRole('button', { name: 'deletegame' }));
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(store().selectedGame).toBeNull();
    expect(store().gamesList.some((game) => game.value === custom.value)).toBe(false);
    expect(await screen.findByText('delete_success')).toBeTruthy();
  });
});
