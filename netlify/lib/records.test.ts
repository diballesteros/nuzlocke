// @vitest-environment node
import { SITEMAP_ROUTES, UNINDEXED_ROUTES } from '../../src/routes/sitemap';
import { FEATURES, GAME_EVENT, ROUTE_PATTERNS } from './contract';
import {
  createRateLimiter,
  dayOf,
  eventKey,
  isBot,
  parseBeacon,
  parseEventKey,
  parseUserAgent,
  referrerHost,
  type TRecord,
  visitorHash,
} from './records';

const CHROME_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

describe('isBot', () => {
  test.each([
    'Googlebot/2.1 (+http://www.google.com/bot.html)',
    'Mozilla/5.0 HeadlessChrome/120.0',
    'curl/8.0',
    'facebookexternalhit/1.1',
    '',
  ])('drops %j', (ua) => {
    expect(isBot(ua)).toBe(true);
  });

  test('keeps a browser', () => {
    expect(isBot(CHROME_MAC)).toBe(false);
  });
});

describe('parseUserAgent', () => {
  test.each([
    [CHROME_MAC, { b: 'Chrome', d: 'Desktop', o: 'macOS' }],
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36 Edg/130.0',
      { b: 'Edge', d: 'Desktop', o: 'Windows' },
    ],
    [
      'Mozilla/5.0 (Windows NT 10.0) Chrome/130.0 Safari/537.36 OPR/110.0',
      { b: 'Opera', d: 'Desktop', o: 'Windows' },
    ],
    [
      'Mozilla/5.0 (Linux; Android 14; SM-S911B) SamsungBrowser/25.0 Chrome/121.0 Mobile Safari/537.36',
      { b: 'Samsung Internet', d: 'Mobile', o: 'Android' },
    ],
    [
      'Mozilla/5.0 (Linux; Android 13; SM-X700) Chrome/120.0 Safari/537.36',
      { b: 'Chrome', d: 'Tablet', o: 'Android' },
    ],
    [
      'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Firefox/130.0',
      { b: 'Firefox', d: 'Desktop', o: 'Linux' },
    ],
    [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Version/17.0 Mobile/15E148 Safari/604.1',
      { b: 'Safari', d: 'Mobile', o: 'iOS' },
    ],
    [
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) Version/17.0 Safari/604.1',
      { b: 'Safari', d: 'Tablet', o: 'iOS' },
    ],
    [
      'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) Chrome/130.0 Safari/537.36',
      { b: 'Chrome', d: 'Desktop', o: 'ChromeOS' },
    ],
    ['SomeThing/1.0', { b: 'Other', d: 'Desktop', o: 'Other' }],
  ])('%s', (ua, expected) => {
    expect(parseUserAgent(ua)).toEqual(expected);
  });
});

describe('referrerHost', () => {
  const own = 'nuzlocke.netlify.app';

  test('keeps only the host', () => {
    expect(referrerHost('https://www.Reddit.com/r/nuzlocke?x=1', own)).toBe('reddit.com');
  });

  test.each([
    ['the site itself', 'https://nuzlocke.netlify.app/rules'],
    ['nothing', ''],
    ['not a string', 42],
    ['not a URL', 'nope'],
    ['another protocol', 'android-app://com.reddit'],
    ['an overlong host', `https://${'a'.repeat(70)}.com/`],
  ])('drops %s', (_, referrer) => {
    expect(referrerHost(referrer, own)).toBeUndefined();
  });
});

describe('parseBeacon', () => {
  test('accepts a page view on a known route', () => {
    expect(parseBeacon('{"k":"p","p":"/rules","g":"13.1","r":"https://a.com/"}')).toEqual({
      k: 'p',
      p: '/rules',
      g: '13.1',
      r: 'https://a.com/',
    });
    expect(parseBeacon('{"k":"p","p":"/badgedetail/1/Boulder"}')).toMatchObject({ k: 'p' });
  });

  test('accepts the known events', () => {
    [GAME_EVENT, ...Object.values(FEATURES)].forEach((name) => {
      expect(parseBeacon(JSON.stringify({ k: 'e', p: '/', n: name, g: 'custom' }))).toMatchObject({
        n: name,
      });
    });
  });

  test.each([
    'not json',
    'null',
    '[]',
    '{"k":"p"}',
    '{"k":"p","p":"/secret"}',
    '{"k":"p","p":"/rules?email=a@b.c"}',
    '{"k":"p","p":"/","g":"<script>"}',
    '{"k":"p","p":"/","g":5}',
    '{"k":"e","p":"/","n":"made_up"}',
    '{"k":"x","p":"/"}',
  ])('drops %s', (body) => {
    expect(parseBeacon(body)).toBeNull();
  });
});

describe('ROUTE_PATTERNS', () => {
  // sitemap.test.ts ties these two lists to AppRouter.tsx
  test.each([...SITEMAP_ROUTES, ...Object.keys(UNINDEXED_ROUTES)])('accepts %s', (route) => {
    const path = route.replace(':game', '13.1').replace(':badge', 'Boulder');
    expect(ROUTE_PATTERNS.some((pattern) => pattern.test(path))).toBe(true);
  });
});

describe('visitorHash', () => {
  test('is short, stable within a salt and hides its inputs', () => {
    const hash = visitorHash('salt', '203.0.113.9', CHROME_MAC);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
    expect(hash).toBe(visitorHash('salt', '203.0.113.9', CHROME_MAC));
    expect(hash).not.toContain('203');
  });

  test('changes with the salt, the IP and the user agent', () => {
    const hash = visitorHash('salt', 'ip', 'ua');
    expect(visitorHash('next-day', 'ip', 'ua')).not.toBe(hash);
    expect(visitorHash('salt', 'other', 'ua')).not.toBe(hash);
    expect(visitorHash('salt', 'ip', 'other')).not.toBe(hash);
  });
});

describe('eventKey', () => {
  const record: TRecord = {
    i: '1-a',
    t: Date.UTC(2026, 9, 31, 23, 59),
    v: 'abc',
    k: 'p',
    p: '/badgedetail/13.1/some-long-badge-name-x',
    r: 'a'.repeat(64),
    c: 'ES',
    g: '13.1',
    d: 'Desktop',
    b: 'Samsung Internet',
    o: 'ChromeOS',
  };

  test('round trips under the record day, within the 600 bytes a key may hold', () => {
    const key = eventKey(record);
    expect(key.startsWith(`events/${dayOf(record.t)}/`)).toBe(true);
    expect(dayOf(record.t)).toBe('2026-10-31');
    expect(parseEventKey(key)).toEqual(record);
    expect(key.length).toBeLessThan(600);
  });

  test('returns null for a key without a valid record', () => {
    expect(parseEventKey('events/2026-10-31/nothing')).toBeNull();
    expect(parseEventKey('events/2026-10-31/x~!!!')).toBeNull();
  });
});

describe('createRateLimiter', () => {
  test('allows up to the limit per key and window', () => {
    const allow = createRateLimiter(2, 1000);
    expect([allow('a', 0), allow('a', 1), allow('a', 2)]).toEqual([true, true, false]);
    expect(allow('b', 2)).toBe(true);
    expect(allow('a', 1000)).toBe(true);
  });

  test('forgets its keys rather than growing without bound', () => {
    const allow = createRateLimiter(1, 1000);
    allow('first', 0);
    for (let i = 0; i < 10_000; i += 1) allow(`key-${i}`, 0);
    expect(allow('first', 0)).toBe(true);
  });
});
