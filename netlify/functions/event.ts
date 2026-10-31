import { randomBytes } from 'node:crypto';
import { getStore, type Store } from '@netlify/blobs';
import type { Config, Context } from '@netlify/functions';
import {
  createRateLimiter,
  dayOf,
  eventKey,
  isBot,
  parseBeacon,
  parseUserAgent,
  referrerHost,
  SALT_PREFIX,
  visitorHash,
} from '../lib/records';

const MAX_BODY = 1024;
const allowVisitor = createRateLimiter(60, 60_000);
const allowInstance = createRateLimiter(1_200, 60_000);

let cachedSalt: { day: string; salt: string } | null = null;

// Random and stored only for its day. The first writer wins, so every instance hashes alike
const dailySalt = async (store: Store, day: string): Promise<string> => {
  if (cachedSalt?.day === day) return cachedSalt.salt;
  const key = `${SALT_PREFIX}${day}`;
  let salt = await store.get(key, { type: 'text', consistency: 'strong' });
  if (!salt) {
    const candidate = randomBytes(32).toString('hex');
    const { modified } = await store.set(key, candidate, { onlyIfNew: true });
    salt = modified ? candidate : await store.get(key, { type: 'text', consistency: 'strong' });
  }
  cachedSalt = { day, salt };
  return salt;
};

// Always the same answer: a beacon has nothing to do with it, and a prober learns nothing
const done = () => new Response(null, { status: 202 });

export default async (req: Request, context: Context): Promise<Response> => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  try {
    if (Netlify.env.get('ANALYTICS_DISABLED') === 'true') return done();
    if (context.deploy.context !== 'production') return done();
    if (req.headers.get('sec-gpc') === '1' || req.headers.get('dnt') === '1') return done();

    const userAgent = req.headers.get('user-agent') ?? '';
    if (isBot(userAgent)) return done();

    const { hostname, host } = new URL(req.url);
    const origin = req.headers.get('origin');
    if (!origin || new URL(origin).host !== host) return done();

    const body = await req.text();
    if (body.length > MAX_BODY) return done();
    const beacon = parseBeacon(body);
    if (!beacon) return done();

    const now = Date.now();
    if (!allowInstance('all', now)) return done();
    const store = getStore('analytics');
    const salt = await dailySalt(store, dayOf(now));
    const visitor = visitorHash(salt, context.ip, userAgent);
    if (!allowVisitor(visitor, now)) return done();

    await store.set(
      eventKey({
        i: `${now}-${randomBytes(4).toString('hex')}`,
        t: now,
        v: visitor,
        k: beacon.k,
        p: beacon.p,
        n: beacon.n,
        g: beacon.g,
        r: referrerHost(beacon.r, hostname),
        c: /^[A-Z]{2}$/.test(context.geo?.country?.code ?? '')
          ? context.geo.country.code
          : undefined,
        ...parseUserAgent(userAgent),
      }),
      '1'
    );
  } catch (error) {
    // Analytics never gets in a visitor's way
    console.error('analytics event failed', error instanceof Error ? error.message : 'unknown');
  }
  return done();
};

export const config: Config = {
  path: '/api/event',
  method: ['POST'],
};
