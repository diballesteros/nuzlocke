// @vitest-environment node
import { eventKey, type TRecord } from './records';
import {
  EVENT_RETENTION_DAYS,
  MAX_EVENTS_PER_VISITOR_DAY,
  runRollup,
  summarize,
  SUMMARY_RETENTION_DAYS,
  type TSummary,
} from './rollup';
import { createFakeStore } from './store.fake';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 31, 12);
const YESTERDAY = NOW - DAY;
let id = 0;

const event = (overrides: Partial<TRecord> = {}): TRecord => {
  id += 1;
  return {
    i: `id-${id}`,
    t: NOW,
    v: 'visitor',
    k: 'p',
    p: '/',
    d: 'Desktop',
    b: 'Chrome',
    o: 'macOS',
    ...overrides,
  };
};

const dayKey = (time: number) => new Date(time).toISOString().slice(0, 10);

describe('summarize', () => {
  const MIN = 60_000;

  test('counts visits, bounces, duration and each dimension', () => {
    const summary = summarize('2026-10-31', [
      // Visitor a: two page views and a feature, then back after the 30 minute gap
      event({ v: 'a', t: NOW, p: '/', r: 'reddit.com', c: 'ES', g: '1' }),
      event({ v: 'a', t: NOW + MIN, p: '/rules', g: '1' }),
      event({ v: 'a', t: NOW + 2 * MIN, p: '/rules', k: 'e', n: 'rules', g: '1' }),
      event({ v: 'a', t: NOW + 2 * MIN + 1000, p: '/rules', k: 'e', n: 'rules', g: '1' }),
      event({ v: 'a', t: NOW + 40 * MIN, p: '/builder' }),
      // Visitor b: one page view, a bounce. Its game event doesn't count as a feature
      event({ v: 'b', t: NOW + MIN, p: '/', d: 'Mobile', b: 'Safari', o: 'iOS', c: 'DE' }),
      event({ v: 'c', t: NOW, p: '/about', k: 'e', n: 'game', g: '2' }),
    ]);
    expect(summary).toEqual<TSummary>({
      day: '2026-10-31',
      visitors: 3,
      pageviews: 4,
      visits: 4,
      bounces: 3,
      duration: 2 * MIN + 1000,
      sources: { 'reddit.com': 1 },
      pages: { '/': 2, '/rules': 1, '/builder': 1 },
      entries: { '/': 2, '/about': 1, '/builder': 1 },
      exits: { '/': 1, '/about': 1, '/builder': 1, '/rules': 1 },
      countries: { DE: 1, ES: 1 },
      devices: { Desktop: 2, Mobile: 1 },
      browsers: { Chrome: 2, Safari: 1 },
      os: { iOS: 1, macOS: 2 },
      games: { '1': 1, '2': 1 },
      features: { rules: 1 },
    });
  });

  test('keeps the top rows of a dimension', () => {
    const records = Array.from({ length: 120 }, (_, i) => event({ v: `v${i}`, c: `C${i}` }));
    expect(Object.keys(summarize('d', records).countries)).toHaveLength(100);
  });
});

describe('runRollup', () => {
  test('compacts raw events into their days, deletes them and summarises closed days', async () => {
    const { store, data } = createFakeStore();
    const today = event({ t: NOW });
    const yesterday = event({ t: YESTERDAY, v: 'y' });
    await store.set(eventKey(today), '1');
    await store.set(eventKey(yesterday), '1');

    await runRollup(store, NOW);

    expect(JSON.parse(data.get(`days/${dayKey(NOW)}`).value)).toEqual([today]);
    expect(JSON.parse(data.get(`days/${dayKey(YESTERDAY)}`).value)).toEqual([yesterday]);
    expect([...data.keys()].filter((key) => key.startsWith('events/'))).toEqual([]);
    // Today is still open
    expect(data.has(`summaries/${dayKey(NOW)}`)).toBe(false);
    expect(JSON.parse(data.get(`summaries/${dayKey(YESTERDAY)}`).value).visitors).toBe(1);
  });

  test('merges later runs, drops copies left by a failed run and refreshes the summary', async () => {
    const { store, data } = createFakeStore();
    const first = event({ t: YESTERDAY, v: 'a' });
    await store.set(eventKey(first), '1');
    await runRollup(store, NOW);

    // A previous run wrote its day but died before deleting this event
    await store.set(eventKey(first), '1');
    const late = event({ t: YESTERDAY + 1000, v: 'b' });
    await store.set(eventKey(late), '1');
    await runRollup(store, NOW);

    expect(JSON.parse(data.get(`days/${dayKey(YESTERDAY)}`).value)).toEqual([first, late]);
    expect(JSON.parse(data.get(`summaries/${dayKey(YESTERDAY)}`).value).visitors).toBe(2);
  });

  test('leaves raw events in place when another run changed the day first', async () => {
    const { store, data, write } = createFakeStore();
    const raw = event({ t: NOW });
    await store.set(eventKey(raw), '1');
    const setJSON = store.setJSON.bind(store);
    store.setJSON = (async (key: string, value: unknown, options: object) => {
      write(key, '[]');
      return setJSON(key, value, options);
    }) as typeof store.setJSON;

    await runRollup(store, NOW);

    expect(data.has(eventKey(raw))).toBe(true);
  });

  test('caps the events one visitor adds to a day', async () => {
    const { store, data } = createFakeStore();
    for (let i = 0; i < MAX_EVENTS_PER_VISITOR_DAY + 5; i += 1) {
      await store.set(eventKey(event({ t: NOW + i })), '1');
    }
    await store.set(eventKey(event({ v: 'other' })), '1');
    await runRollup(store, NOW + 1000);
    expect(JSON.parse(data.get(`days/${dayKey(NOW)}`).value)).toHaveLength(
      MAX_EVENTS_PER_VISITOR_DAY + 1
    );
  });

  test('deletes unreadable raw keys', async () => {
    const { store, data } = createFakeStore();
    await store.set('events/2026-10-31/broken', '1');
    await runRollup(store, NOW);
    expect(data.size).toBe(0);
  });

  test('summarises a compacted day that has no summary, reading it back', async () => {
    const { store, data } = createFakeStore();
    await store.setJSON(`days/${dayKey(YESTERDAY)}`, [event({ t: YESTERDAY })]);
    await runRollup(store, NOW);
    expect(JSON.parse(data.get(`summaries/${dayKey(YESTERDAY)}`).value).pageviews).toBe(1);
  });

  test('summarises a day deleted while it ran as empty', async () => {
    const { store, data } = createFakeStore();
    await store.setJSON(`days/${dayKey(YESTERDAY)}`, []);
    store.get = (async () => null) as typeof store.get;
    await runRollup(store, NOW);
    expect(JSON.parse(data.get(`summaries/${dayKey(YESTERDAY)}`).value).visitors).toBe(0);
  });

  test('applies retention and removes closed days salts', async () => {
    const { store, data } = createFakeStore();
    const oldDay = dayKey(NOW - (EVENT_RETENTION_DAYS + 1) * DAY);
    const keptDay = dayKey(NOW - (EVENT_RETENTION_DAYS - 1) * DAY);
    const oldSummary = dayKey(NOW - (SUMMARY_RETENTION_DAYS + 1) * DAY);
    await store.setJSON(`days/${oldDay}`, []);
    await store.setJSON(`days/${keptDay}`, []);
    await store.setJSON(`summaries/${oldSummary}`, {});
    await store.set(`salts/${dayKey(YESTERDAY)}`, 'old');
    await store.set(`salts/${dayKey(NOW)}`, 'current');

    await runRollup(store, NOW);

    // An expired day's events go, and its summary stays
    expect(data.has(`days/${oldDay}`)).toBe(false);
    expect(data.has(`summaries/${oldDay}`)).toBe(true);
    expect(data.has(`days/${keptDay}`)).toBe(true);
    expect(data.has(`summaries/${oldSummary}`)).toBe(false);
    expect(data.has(`salts/${dayKey(YESTERDAY)}`)).toBe(false);
    expect(data.has(`salts/${dayKey(NOW)}`)).toBe(true);
  });

  test('stops deleting at the time budget and finishes on the next run', async () => {
    const { store, data } = createFakeStore();
    const raw = event({ t: NOW });
    await store.set(eventKey(raw), '1');
    let time = 0;
    const clock = () => {
      time += 30_000;
      return time;
    };
    await runRollup(store, NOW, clock);
    expect(data.has(eventKey(raw))).toBe(true);
    await runRollup(store, NOW);
    expect(data.has(eventKey(raw))).toBe(false);
    expect(JSON.parse(data.get(`days/${dayKey(NOW)}`).value)).toEqual([raw]);
  });
});
