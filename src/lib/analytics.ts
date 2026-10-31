import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { MAX_GAME } from 'constants/constant';
import type { AppState } from 'constants/types';
import useStore from 'store';
import {
  CUSTOM_GAME,
  EVENT_ENDPOINT,
  FEATURES,
  GAME_EVENT,
  PRODUCTION_HOST,
  type TBeacon,
} from '../../netlify/lib/contract';

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

// Only the live site counts, never localhost or a deploy preview, and a visitor's privacy signal
// wins. The collector checks all of it again
export const canTrack = (): boolean =>
  import.meta.env.REACT_APP_ANALYTICS_DISABLED !== 'true' &&
  window.location.hostname === PRODUCTION_HOST &&
  !navigator.globalPrivacyControl &&
  navigator.doNotTrack !== '1' &&
  typeof navigator.sendBeacon === 'function';

const gameKey = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  return Number(value) > MAX_GAME ? CUSTOM_GAME : value;
};

const send = (beacon: Omit<TBeacon, 'p' | 'g'>, path = window.location.pathname) => {
  const body: TBeacon = { ...beacon, p: path, g: gameKey(useStore.getState().selectedGame?.value) };
  navigator.sendBeacon(
    EVENT_ENDPOINT,
    new Blob([JSON.stringify(body)], { type: 'application/json' })
  );
};

let referrerSent = false;

export const trackPageView = (path: string): void => {
  if (!canTrack()) return;
  // document.referrer stays the same through a visit's route changes
  send(referrerSent ? { k: 'p' } : { k: 'p', r: document.referrer || undefined }, path);
  referrerSent = true;
};

let unsubscribe: (() => void) | null = null;

// Reads the store without writing to it. Each feature is sent once per page load, so a busy session
// costs a handful of beacons
export const trackStoreEvents = (): void => {
  if (unsubscribe || !canTrack()) return;
  const sent = new Set<string>();
  unsubscribe = useStore.subscribe((state: AppState, previous: AppState) => {
    if (state.selectedGame?.value !== previous.selectedGame?.value && state.selectedGame?.value) {
      send({ k: 'e', n: GAME_EVENT });
    }
    (Object.keys(FEATURES) as (keyof typeof FEATURES)[]).forEach((slice) => {
      if (state[slice] === previous[slice] || sent.has(slice)) return;
      sent.add(slice);
      send({ k: 'e', n: FEATURES[slice] });
    });
  });
};

export const resetAnalytics = (): void => {
  unsubscribe?.();
  unsubscribe = null;
  referrerSent = false;
};

// Renders nothing. Sits inside the router, and counts route changes as well as page loads
export function Analytics(): null {
  const { pathname } = useLocation();
  useEffect(() => {
    trackStoreEvents();
  }, []);
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}
