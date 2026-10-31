// @vitest-environment node
import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';
import { parseEventKey } from '../lib/records';
import { createFakeStore } from '../lib/store.fake';
import rollup, { config as rollupConfig } from './analytics-rollup';
import event, { config } from './event';

vi.mock('@netlify/blobs', () => ({ getStore: vi.fn() }));

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/130.0 Safari/537.36';
const NOW = Date.UTC(2026, 9, 31, 12);
const URL_ = 'https://nuzlocke.netlify.app/api/event';

const context = (overrides: Partial<Context> = {}) =>
  ({
    deploy: { context: 'production' },
    geo: { country: { code: 'ES' } },
    ip: '203.0.113.9',
    ...overrides,
  }) as Context;

const request = (headers: Record<string, string> = {}, body: unknown = { k: 'p', p: '/rules' }) =>
  new Request(URL_, {
    method: 'POST',
    headers: { 'origin': 'https://nuzlocke.netlify.app', 'user-agent': UA, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

let time = NOW;
let fake: ReturnType<typeof createFakeStore>;
const env: Record<string, string> = {};
const events = () => [...fake.data.keys()].filter((key) => key.startsWith('events/'));
const decoded = (key: string) => parseEventKey(key);

beforeEach(() => {
  // Each test gets its own day: the salt is cached per day, and the store is new
  time += 24 * 60 * 60 * 1000;
  vi.spyOn(Date, 'now').mockImplementation(() => time);
  fake = createFakeStore();
  vi.mocked(getStore).mockReturnValue(fake.store);
  Object.keys(env).forEach((key) => delete env[key]);
  vi.stubGlobal('Netlify', { env: { get: (key: string) => env[key] } });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('event function', () => {
  test('stores one record with the derived fields and nothing raw', async () => {
    const response = await event(
      request({}, { k: 'p', p: '/rules', r: 'https://reddit.com/r/x', g: '3' }),
      context()
    );
    expect(response.status).toBe(202);
    expect(events()).toHaveLength(1);
    const key = events()[0];
    expect(decoded(key)).toMatchObject({
      t: time,
      k: 'p',
      p: '/rules',
      g: '3',
      r: 'reddit.com',
      c: 'ES',
      d: 'Desktop',
      b: 'Chrome',
      o: 'macOS',
    });
    expect(decoded(key).v).toMatch(/^[0-9a-f]{16}$/);
    const stored = JSON.stringify(decoded(key));
    expect(stored).not.toContain('203.0.113.9');
    expect(stored).not.toContain('Mozilla');
  });

  test('gives a visitor one hash through the day, from one stored salt', async () => {
    await event(request(), context());
    await event(request(), context());
    const [a, b] = events().map((key) => decoded(key).v);
    expect(a).toBe(b);
    expect([...fake.data.keys()].filter((key) => key.startsWith('salts/'))).toHaveLength(1);
  });

  test('uses the salt another instance stored first', async () => {
    const day = new Date(time).toISOString().slice(0, 10);
    const set = fake.store.set.bind(fake.store);
    fake.store.set = (async (key: string, value: string, options: object) => {
      if (key.startsWith('salts/')) fake.write(`salts/${day}`, 'theirs');
      return set(key, value, options);
    }) as typeof fake.store.set;
    await event(request(), context());
    expect(fake.data.get(`salts/${day}`).value).toBe('theirs');
    expect(events()).toHaveLength(1);
  });

  test('reuses a salt already stored for the day', async () => {
    const salt = `salts/${new Date(time).toISOString().slice(0, 10)}`;
    fake.write(salt, 'stored');
    await event(request(), context());
    expect(fake.data.get(salt).value).toBe('stored');
    expect(events()).toHaveLength(1);
  });

  test('omits a country it does not recognise', async () => {
    await event(request(), context({ geo: {} as Context['geo'] }));
    expect(decoded(events()[0]).c).toBeUndefined();
  });

  test.each<[string, Record<string, string>, unknown, Partial<Context>]>([
    ['Global Privacy Control', { 'sec-gpc': '1' }, undefined, {}],
    ['Do Not Track', { 'dnt': '1' }, undefined, {}],
    ['a bot', { 'user-agent': 'Googlebot/2.1' }, undefined, {}],
    ['another origin', { 'origin': 'https://evil.example' }, undefined, {}],
    ['an unknown route', {}, { k: 'p', p: '/admin' }, {}],
    ['an oversized body', {}, 'x'.repeat(2000), {}],
    ['a deploy preview', {}, undefined, { deploy: { context: 'deploy-preview' } as never }],
    ['local dev', {}, undefined, { deploy: { context: 'dev' } as never }],
  ])('drops %s', async (_, headers, body, overrides) => {
    const response = await event(request(headers, body), context(overrides));
    expect(response.status).toBe(202);
    expect(events()).toHaveLength(0);
  });

  test('drops a request without an origin', async () => {
    const req = new Request(URL_, { method: 'POST', headers: { 'user-agent': UA }, body: '{}' });
    await event(req, context());
    expect(events()).toHaveLength(0);
  });

  test('drops a request with no user agent', async () => {
    const req = new Request(URL_, {
      method: 'POST',
      headers: { origin: 'https://nuzlocke.netlify.app' },
      body: JSON.stringify({ k: 'p', p: '/' }),
    });
    await event(req, context());
    expect(events()).toHaveLength(0);
  });

  test('stores nothing with the kill switch on', async () => {
    env.ANALYTICS_DISABLED = 'true';
    await event(request(), context());
    expect(fake.data.size).toBe(0);
  });

  test('rejects other methods', async () => {
    const response = await event(new Request(URL_), context());
    expect(response.status).toBe(405);
  });

  test('rate-limits one visitor', async () => {
    const ctx = context({ ip: '198.51.100.1' });
    for (let i = 0; i < 65; i += 1) await event(request(), ctx);
    expect(events().length).toBeLessThanOrEqual(60);
  });

  test('rate-limits one instance, whoever is calling', async () => {
    for (let i = 0; i < 1300; i += 1) {
      await event(request(), context({ ip: `198.51.100.${i}` }));
    }
    expect(events().length).toBeLessThanOrEqual(1200);
  });

  test('never fails the visitor when storage does', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getStore).mockImplementation(() => {
      throw new Error('blobs down');
    });
    const response = await event(request(), context());
    expect(response.status).toBe(202);
    expect(consoleError).toHaveBeenCalledWith('analytics event failed', 'blobs down');

    vi.mocked(getStore).mockImplementation(() => {
      throw 'odd';
    });
    await event(request(), context());
    expect(consoleError).toHaveBeenCalledWith('analytics event failed', 'unknown');
  });

  test('is served at the beacon path', () => {
    expect(config.path).toBe('/api/event');
  });
});

describe('analytics-rollup function', () => {
  test('runs hourly and rolls up the store', async () => {
    await event(request(), context());
    await rollup();
    expect(events()).toHaveLength(0);
    expect([...fake.data.keys()].some((key) => key.startsWith('days/'))).toBe(true);
    expect(rollupConfig.schedule).toBe('@hourly');
  });
});
