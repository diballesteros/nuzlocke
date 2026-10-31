import type { Store } from '@netlify/blobs';
import {
  DAY_PREFIX,
  dayOf,
  EVENT_PREFIX,
  parseEventKey,
  SALT_PREFIX,
  SUMMARY_PREFIX,
  type TRecord,
} from './records';

const DAY_MS = 24 * 60 * 60 * 1000;
const VISIT_GAP_MS = 30 * 60 * 1000;
// Filtering and bounce rate need each day's events; older days keep only their summaries
export const EVENT_RETENTION_DAYS = 90;
export const SUMMARY_RETENTION_DAYS = 400;
export const MAX_EVENTS_PER_VISITOR_DAY = 500;
const MAX_ROWS = 100;
const DELETE_BATCH = 50;
// Scheduled functions stop at 30 s. Whatever is left waits for the next hourly run
const TIME_BUDGET_MS = 20_000;

type TCounts = Record<string, number>;

export interface TSummary {
  day: string;
  visitors: number;
  pageviews: number;
  visits: number;
  bounces: number;
  // Total ms between the first and last event of each visit
  duration: number;
  sources: TCounts;
  pages: TCounts;
  entries: TCounts;
  exits: TCounts;
  countries: TCounts;
  devices: TCounts;
  browsers: TCounts;
  os: TCounts;
  games: TCounts;
  features: TCounts;
}

const top = (counts: Map<string, number>): TCounts =>
  Object.fromEntries(
    [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, MAX_ROWS)
  );

const add = (counts: Map<string, number>, key: string) =>
  counts.set(key, (counts.get(key) ?? 0) + 1);

// Unique visitors per value of one dimension
const uniques = (records: TRecord[], value: (record: TRecord) => string | undefined) => {
  const seen = new Set<string>();
  const counts = new Map<string, number>();
  records.forEach((record) => {
    const key = value(record);
    if (key === undefined || seen.has(`${record.v}|${key}`)) return;
    seen.add(`${record.v}|${key}`);
    add(counts, key);
  });
  return top(counts);
};

export const summarize = (day: string, records: TRecord[]): TSummary => {
  const sorted = [...records].sort((a, b) => a.t - b.t);
  const byVisitor = new Map<string, TRecord[]>();
  sorted.forEach((record) => {
    const own = byVisitor.get(record.v);
    if (own) own.push(record);
    else byVisitor.set(record.v, [record]);
  });

  const pages = new Map<string, number>();
  const entries = new Map<string, number>();
  const exits = new Map<string, number>();
  const features = new Map<string, number>();
  let pageviews = 0;
  let visits = 0;
  let bounces = 0;
  let duration = 0;

  sorted.forEach((record) => {
    if (record.k === 'p') {
      pageviews += 1;
      add(pages, record.p);
    }
  });

  const closeVisit = (visit: TRecord[]) => {
    visits += 1;
    duration += visit[visit.length - 1].t - visit[0].t;
    if (visit.length === 1) bounces += 1;
    add(entries, visit[0].p);
    add(exits, visit[visit.length - 1].p);
  };
  byVisitor.forEach((own) => {
    let visit: TRecord[] = [];
    own.forEach((record) => {
      if (visit.length && record.t - visit[visit.length - 1].t > VISIT_GAP_MS) {
        closeVisit(visit);
        visit = [];
      }
      visit.push(record);
    });
    closeVisit(visit);
  });

  const seenFeature = new Set<string>();
  sorted.forEach((record) => {
    if (record.k !== 'e' || record.n === 'game' || seenFeature.has(`${record.v}|${record.n}`)) {
      return;
    }
    seenFeature.add(`${record.v}|${record.n}`);
    add(features, record.n);
  });

  return {
    day,
    visitors: byVisitor.size,
    pageviews,
    visits,
    bounces,
    duration,
    sources: uniques(sorted, (record) => record.r),
    pages: top(pages),
    entries: top(entries),
    exits: top(exits),
    countries: uniques(sorted, (record) => record.c),
    devices: uniques(sorted, (record) => record.d),
    browsers: uniques(sorted, (record) => record.b),
    os: uniques(sorted, (record) => record.o),
    games: uniques(sorted, (record) => record.g),
    features: top(features),
  };
};

// One visitor can't outweigh the rest of the day, whichever instances took the events
const capPerVisitor = (records: TRecord[]) => {
  const counts = new Map<string, number>();
  return records.filter((record) => {
    add(counts, record.v);
    return counts.get(record.v) <= MAX_EVENTS_PER_VISITOR_DAY;
  });
};

const dayFromKey = (key: string, prefix: string) => key.slice(prefix.length, prefix.length + 10);

const deleteAll = async (store: Store, keys: string[], deadline: number, clock: () => number) => {
  for (let start = 0; start < keys.length && clock() < deadline; start += DELETE_BATCH) {
    await Promise.all(keys.slice(start, start + DELETE_BATCH).map((key) => store.delete(key)));
  }
};

// Merges a day's raw events into its compact blob and only then deletes them. A run that fails
// half way leaves events in both places, and the next run's merge drops the copies by id
const compactDay = async (
  store: Store,
  day: string,
  raw: { key: string; record: TRecord }[],
  etag: string | undefined,
  deadline: number,
  clock: () => number
): Promise<TRecord[] | null> => {
  const key = `${DAY_PREFIX}${day}`;
  const existing: TRecord[] = (await store.get(key, { type: 'json', consistency: 'strong' })) ?? [];
  const ids = new Set(existing.map((record) => record.i));
  const merged = capPerVisitor(
    [...existing, ...raw.map(({ record }) => record).filter((record) => !ids.has(record.i))].sort(
      (a, b) => a.t - b.t
    )
  );
  // Conditional, so overlapping runs can't lose each other's events: the loser leaves its raw
  // events in place for the next run. The ETag was read before the data, so a change in between
  // fails this write instead of being overwritten
  const { modified } = await store.setJSON(
    key,
    merged,
    etag ? { onlyIfMatch: etag } : { onlyIfNew: true }
  );
  if (!modified) return null;
  await deleteAll(
    store,
    raw.map((entry) => entry.key),
    deadline,
    clock
  );
  return merged;
};

export const runRollup = async (store: Store, now: number, clock: () => number = Date.now) => {
  const deadline = clock() + TIME_BUDGET_MS;
  const today = dayOf(now);

  const { blobs: rawBlobs } = await store.list({ prefix: EVENT_PREFIX });
  const rawByDay = new Map<string, { key: string; record: TRecord }[]>();
  const corrupt: string[] = [];
  rawBlobs.forEach(({ key }) => {
    const record = parseEventKey(key);
    if (!record) {
      corrupt.push(key);
      return;
    }
    const day = dayFromKey(key, EVENT_PREFIX);
    if (!rawByDay.has(day)) rawByDay.set(day, []);
    rawByDay.get(day).push({ key, record });
  });
  await deleteAll(store, corrupt, deadline, clock);

  // From list(), which the local Blobs server answers with ETags; its get() leaves them out
  const dayETags = new Map(
    (await store.list({ prefix: DAY_PREFIX })).blobs.map(({ key, etag }) => [key, etag])
  );
  const compacted = new Map<string, TRecord[]>();
  for (const [day, raw] of rawByDay) {
    const merged = await compactDay(
      store,
      day,
      raw,
      dayETags.get(`${DAY_PREFIX}${day}`),
      deadline,
      clock
    );
    if (merged) compacted.set(day, merged);
  }

  const { blobs: dayBlobs } = await store.list({ prefix: DAY_PREFIX });
  const { blobs: summaryBlobs } = await store.list({ prefix: SUMMARY_PREFIX });
  const summaries = new Set(summaryBlobs.map(({ key }) => dayFromKey(key, SUMMARY_PREFIX)));

  // A closed day gets its summary once, and again if late events reached it
  for (const { key } of dayBlobs) {
    const day = dayFromKey(key, DAY_PREFIX);
    if (day < today && (compacted.has(day) || !summaries.has(day))) {
      const records: TRecord[] =
        compacted.get(day) ?? (await store.get(key, { type: 'json', consistency: 'strong' })) ?? [];
      await store.setJSON(`${SUMMARY_PREFIX}${day}`, summarize(day, records));
      summaries.add(day);
    }
  }

  const before = (days: number) => dayOf(now - days * DAY_MS);
  const expired = [
    ...dayBlobs
      .map(({ key }) => key)
      .filter((key) => {
        const day = dayFromKey(key, DAY_PREFIX);
        return day < before(EVENT_RETENTION_DAYS) && summaries.has(day);
      }),
    ...summaryBlobs
      .map(({ key }) => key)
      .filter((key) => dayFromKey(key, SUMMARY_PREFIX) < before(SUMMARY_RETENTION_DAYS)),
    // A closed day's salt must be gone, or its hashes could be tied back to an IP and user agent
    ...(await store.list({ prefix: SALT_PREFIX })).blobs
      .map(({ key }) => key)
      .filter((key) => dayFromKey(key, SALT_PREFIX) < today),
  ];
  await deleteAll(store, expired, deadline, clock);
};
