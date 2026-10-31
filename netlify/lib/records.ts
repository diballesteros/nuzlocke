import { createHash } from 'node:crypto';
import { CUSTOM_GAME, FEATURES, GAME_EVENT, ROUTE_PATTERNS, type TBeacon } from './contract';

export const EVENT_PREFIX = 'events/';
export const DAY_PREFIX = 'days/';
export const SUMMARY_PREFIX = 'summaries/';
export const SALT_PREFIX = 'salts/';

export interface TRecord {
  // Id, unique within the day, so compacting twice can't count an event twice
  i: string;
  // Time in ms
  t: number;
  // Visitor hash
  v: string;
  k: 'p' | 'e';
  p: string;
  n?: string;
  g?: string;
  // Referrer host, country, device class, browser, OS
  r?: string;
  c?: string;
  d: string;
  b: string;
  o: string;
}

const BOT =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|pagespeed|headless|phantomjs|puppeteer|playwright|selenium|curl|wget|python-|axios|node-fetch|go-http|java\/|httpclient/i;

export const isBot = (userAgent: string): boolean => !userAgent || BOT.test(userAgent);

// Only the family, device class and OS name are kept. The user agent itself is never stored
export const parseUserAgent = (ua: string): { b: string; d: string; o: string } => {
  let b = 'Other';
  if (/Edg(e|A|iOS)?\//.test(ua)) b = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) b = 'Opera';
  else if (/SamsungBrowser\//.test(ua)) b = 'Samsung Internet';
  else if (/Firefox\/|FxiOS\//.test(ua)) b = 'Firefox';
  else if (/Chrome\/|CriOS\//.test(ua)) b = 'Chrome';
  else if (/Safari\//.test(ua)) b = 'Safari';

  let o = 'Other';
  if (/Windows/.test(ua)) o = 'Windows';
  else if (/iPhone|iPad|iPod/.test(ua)) o = 'iOS';
  else if (/Android/.test(ua)) o = 'Android';
  else if (/Mac OS X|Macintosh/.test(ua)) o = 'macOS';
  else if (/CrOS/.test(ua)) o = 'ChromeOS';
  else if (/Linux/.test(ua)) o = 'Linux';

  let d = 'Desktop';
  if (/iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))) d = 'Tablet';
  else if (/Mobi|iPhone|iPod/.test(ua)) d = 'Mobile';

  return { b, d, o };
};

export const referrerHost = (referrer: unknown, ownHost: string): string | undefined => {
  if (typeof referrer !== 'string' || !referrer) return undefined;
  try {
    const { hostname, protocol } = new URL(referrer);
    const host = hostname.replace(/^www\./, '').toLowerCase();
    if (!/^https?:$/.test(protocol) || host === ownHost || host.length > 64) return undefined;
    return host;
  } catch {
    return undefined;
  }
};

const KNOWN_EVENTS: readonly string[] = [GAME_EVENT, ...Object.values(FEATURES)];

const validGame = (game: unknown) =>
  typeof game === 'string' && (game === CUSTOM_GAME || /^\d{1,2}(\.\d)?$/.test(game));

// The body comes from strangers: anything outside the contract is dropped
export const parseBeacon = (body: string): TBeacon | null => {
  let raw: Partial<TBeacon> | null;
  try {
    raw = JSON.parse(body);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null || typeof raw.p !== 'string') return null;
  const path = raw.p;
  if (!ROUTE_PATTERNS.some((pattern) => pattern.test(path))) return null;
  if (raw.g !== undefined && !validGame(raw.g)) return null;
  if (raw.k === 'p') return { k: 'p', p: path, g: raw.g, r: raw.r };
  if (raw.k === 'e' && KNOWN_EVENTS.includes(raw.n)) return { k: 'e', p: path, g: raw.g, n: raw.n };
  return null;
};

export const dayOf = (time: number): string => new Date(time).toISOString().slice(0, 10);

// Plausible's method: without the salt, which is deleted when its day ends, the hash can't be tied
// back to an IP, and the same visitor gets a different hash the next day
export const visitorHash = (salt: string, ip: string, userAgent: string): string =>
  createHash('sha256').update(`${salt}|${ip}|${userAgent}`).digest('hex').slice(0, 16);

// The record lives in the key: list() returns 1,000 keys per request, where reading values would
// take one request per event. Everything in a record is validated and short, far below the 600
// bytes a key may hold
// Split into path segments, because the local Blobs server keeps each key as a file, and a file
// name stops at 255 bytes
export const eventKey = (record: TRecord): string => {
  const encoded = Buffer.from(JSON.stringify(record)).toString('base64url');
  return `${EVENT_PREFIX}${dayOf(record.t)}/${record.i}~${encoded.replace(/.{200}/g, '$&/')}`;
};

export const parseEventKey = (key: string): TRecord | null => {
  const encoded = key.split('~')[1]?.replaceAll('/', '');
  if (!encoded) return null;
  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString());
  } catch {
    return null;
  }
};

// Each instance's own count, so it's a best effort against bursts. The roll-up's cap per visitor
// holds across instances
export const createRateLimiter = (limit: number, windowMs: number) => {
  const hits = new Map<string, { count: number; start: number }>();
  return (key: string, now: number): boolean => {
    const hit = hits.get(key);
    if (!hit || now - hit.start >= windowMs) {
      // Instances are short-lived, but a long-lived one shouldn't grow without bound
      if (hits.size >= 10_000) hits.clear();
      hits.set(key, { count: 1, start: now });
      return true;
    }
    hit.count += 1;
    return hit.count <= limit;
  };
};
