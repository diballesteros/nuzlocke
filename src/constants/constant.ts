import D_P_PLAT from 'constants/locations/D_P_PLAT';
import FR_LG from 'constants/locations/FR_LG';
import R_B_Y from 'constants/locations/R_B_Y';
import G_S_C from 'constants/locations/G_S_C';
import R_S_E from 'constants/locations/R_S_E';
import OR_AS from 'constants/locations/OR_AS';
import B_W from 'constants/locations/B_W';
import B_W_2 from 'constants/locations/B_W_2';
import X_Y from 'constants/locations/X_Y';
import SW_SH from 'constants/locations/SW_SH';
import S_M from 'constants/locations/S_M';
import US_UM from 'constants/locations/US_UM';
import { TGame, TrackerState } from 'constants/types';

export const INITIAL_STATE: TrackerState = {
  darkMode: false,
  selectedGame: null,
  games: {
    '1': { badge: null, encounters: R_B_Y },
    '2': { badge: null, encounters: G_S_C },
    '3': { badge: null, encounters: R_S_E },
    '4': { badge: null, encounters: FR_LG },
    '5': { badge: null, encounters: D_P_PLAT },
    '6': { badge: null, encounters: [...G_S_C] },
    '7': { badge: null, encounters: B_W },
    '8': { badge: null, encounters: B_W_2 },
    '9': { badge: null, encounters: X_Y },
    '10': { badge: null, encounters: OR_AS },
    '11': { badge: null, encounters: S_M },
    '12': { badge: null, encounters: US_UM },
    '13': { badge: null, encounters: SW_SH },
    '14': { badge: null, encounters: [] },
  },
  text: null,
};

export const GAMES: TGame[] = [
  {
    id: '1',
    name: 'Red, Blue and Yellow',
  },
  {
    id: '2',
    name: 'Gold, Silver and Crystal',
  },
  {
    id: '3',
    name: 'Ruby, Sapphire and Emerald',
  },
  {
    id: '4',
    name: 'FireRed and LeafGreen',
  },
  {
    id: '5',
    name: 'Diamond, Pearl and Platinum',
  },
  {
    id: '6',
    name: 'HeartGold and SoulSilver',
  },
  {
    id: '7',
    name: 'Black and White',
  },
  {
    id: '8',
    name: 'Black 2 and White 2',
  },
  {
    id: '9',
    name: 'X and Y',
  },
  {
    id: '10',
    name: 'Omega Ruby and Alpha Sapphire',
  },
  {
    id: '11',
    name: 'Sun and Moon',
  },
  {
    id: '12',
    name: 'Ultra Sun and Ultra Moon',
  },
  {
    id: '14',
    name: 'Sword and Shield',
  },
];
