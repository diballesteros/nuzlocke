// What the app may send and the collector may accept. The app imports this file too, so it has to
// stay free of server-only code

export const EVENT_ENDPOINT = '/api/event';

export const PRODUCTION_HOST = 'nuzlocke.netlify.app';

// Page routes of src/routes/AppRouter.tsx. Anything else is dropped, so nobody can fill the
// dashboard with made-up paths
export const ROUTE_PATTERNS = [
  /^\/$/,
  /^\/rules$/,
  /^\/stats$/,
  /^\/builder$/,
  /^\/calculator$/,
  /^\/settings$/,
  /^\/report$/,
  /^\/changelog$/,
  /^\/about$/,
  /^\/import$/,
  /^\/delete$/,
  /^\/badgedetail\/[\w.-]{1,16}\/[\w.-]{1,32}$/,
];

// Parts of the store whose first change in a page load counts as using that feature. The game
// event is separate because it carries a value
export const FEATURES = {
  badges: 'badges',
  calcs: 'calculator',
  customBadges: 'custom_badges',
  customStatuses: 'custom_statuses',
  games: 'encounters',
  gamesList: 'custom_game',
  nicknames: 'nicknames',
  notes: 'notes',
  rules: 'rules',
  soulink: 'soul_link',
  summary: 'summary',
  team: 'builder',
} as const;

export const GAME_EVENT = 'game';

// Sent instead of a custom game's key: those are numbered per browser, so they mean nothing across
// visitors
export const CUSTOM_GAME = 'custom';

export interface TBeacon {
  // Route of the page
  p: string;
  // Kind: page view or custom event
  k: 'p' | 'e';
  // The selected game's key
  g?: string;
  // Event name, for kind 'e'
  n?: string;
  // document.referrer, only on the first page view of a page load
  r?: string;
}
