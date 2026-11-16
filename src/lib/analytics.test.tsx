import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router';
import useStore from 'store';
import { CUSTOM_GAME, FEATURES, GAME_EVENT, PRODUCTION_HOST } from '../../netlify/lib/contract';
import { parseBeacon } from '../../netlify/lib/records';
import { Analytics, canTrack, resetAnalytics, trackPageView, trackStoreEvents } from './analytics';

const sendBeacon = vi.fn<(url: string, body: Blob) => boolean>(() => true);

const setHost = (hostname: string) =>
  vi.stubGlobal('location', { hostname, pathname: '/' } as Location);

const sent = async () =>
  Promise.all(sendBeacon.mock.calls.map(async ([, body]) => JSON.parse(await body.text())));

const initial = useStore.getState();

beforeEach(() => {
  sendBeacon.mockClear();
  setHost(PRODUCTION_HOST);
  vi.stubGlobal(
    'navigator',
    Object.assign(Object.create(navigator), { sendBeacon, doNotTrack: null })
  );
  resetAnalytics();
  useStore.setState(initial, true);
});

afterEach(() => {
  resetAnalytics();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('canTrack', () => {
  test('tracks on the production host', () => {
    expect(canTrack()).toBe(true);
  });

  test.each(['localhost', '127.0.0.1', 'deploy-preview-12--nuzlocke.netlify.app'])(
    'skips %s',
    (host) => {
      setHost(host);
      expect(canTrack()).toBe(false);
    }
  );

  test('respects Global Privacy Control', () => {
    vi.stubGlobal(
      'navigator',
      Object.assign(Object.create(navigator), { globalPrivacyControl: true })
    );
    expect(canTrack()).toBe(false);
  });

  test('respects Do Not Track', () => {
    vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { doNotTrack: '1' }));
    expect(canTrack()).toBe(false);
  });

  test('stays off with the kill switch', () => {
    vi.stubEnv('REACT_APP_ANALYTICS_DISABLED', 'true');
    expect(canTrack()).toBe(false);
  });

  test('stays off without sendBeacon', () => {
    vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { sendBeacon: undefined }));
    expect(canTrack()).toBe(false);
  });
});

describe('trackPageView', () => {
  test('sends nothing when it may not track', () => {
    setHost('localhost');
    trackPageView('/');
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  test('sends the referrer once, and the collector accepts what it sends', async () => {
    vi.spyOn(document, 'referrer', 'get').mockReturnValue('https://reddit.com/r/x');
    useStore.setState({ selectedGame: { value: '3', text: 'Crystal' } } as never);
    trackPageView('/');
    trackPageView('/rules');
    vi.restoreAllMocks();
    const [first, second] = await sent();
    expect(sendBeacon.mock.calls[0][0]).toBe('/api/event');
    expect(first).toEqual({ k: 'p', p: '/', g: '3', r: 'https://reddit.com/r/x' });
    expect(second).toEqual({ k: 'p', p: '/rules', g: '3' });
    expect(parseBeacon(JSON.stringify(first))).toMatchObject({ p: '/' });
    expect(parseBeacon(JSON.stringify(second))).toMatchObject({ p: '/rules' });
  });

  test('sends custom games under one name', async () => {
    useStore.setState({ selectedGame: { value: '14.1', text: 'My secret run' } } as never);
    trackPageView('/');
    expect((await sent())[0].g).toBe(CUSTOM_GAME);
  });
});

describe('trackStoreEvents', () => {
  test('sends nothing when it may not track', () => {
    setHost('localhost');
    trackStoreEvents();
    useStore.setState({ selectedGame: { value: '3', text: 'Crystal' } } as never);
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  test('sends every change of game, and leaves the store alone', async () => {
    trackStoreEvents();
    const before = localStorage.getItem('pokemon-tracker');
    useStore.setState({ selectedGame: { value: '3', text: 'Crystal' } } as never);
    useStore.setState({ selectedGame: { value: '5', text: 'Emerald' } } as never);
    useStore.setState({ selectedGame: null } as never);
    const beacons = await sent();
    expect(beacons.map(({ n, g }) => [n, g])).toEqual([
      [GAME_EVENT, '3'],
      [GAME_EVENT, '5'],
    ]);
    expect(parseBeacon(JSON.stringify(beacons[0]))).toMatchObject({ n: GAME_EVENT });
    expect(localStorage.getItem('pokemon-tracker')).toBe(before);
  });

  test('sends each feature once per page load', async () => {
    trackStoreEvents();
    trackStoreEvents();
    useStore.setState({ notes: { a: 'one' } } as never);
    useStore.setState({ notes: { a: 'two' } } as never);
    useStore.setState({ team: {} } as never);
    useStore.setState({ text: 'search' });
    const beacons = await sent();
    expect(beacons.map(({ n }) => n)).toEqual([FEATURES.notes, FEATURES.team]);
    beacons.forEach((beacon) => {
      expect(parseBeacon(JSON.stringify(beacon))).not.toBeNull();
    });
  });
});

describe('Analytics', () => {
  test('sends one beacon per route change, none for the same route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Analytics />
        <Link to="/rules">rules</Link>
        <Link to="/rules?x=1">query</Link>
      </MemoryRouter>
    );
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('rules'));
    expect(sendBeacon).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByText('query'));
    expect(sendBeacon).toHaveBeenCalledTimes(2);
    expect((await sent()).map(({ p }) => p)).toEqual(['/', '/rules']);
  });

  test('renders nothing', () => {
    const { container } = render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe('');
  });
});
