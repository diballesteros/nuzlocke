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
import { AppState, TGame, TRule } from 'constants/types';
import BADGES from 'constants/badges';

export const GAMES: TGame[] = [
  {
    value: '1',
    text: 'Red, Blue and Yellow',
    key: '1',
  },
  {
    value: '2',
    text: 'Gold, Silver and Crystal',
    key: '2',
  },
  {
    value: '3',
    text: 'Ruby, Sapphire and Emerald',
    key: '3',
  },
  {
    value: '4',
    text: 'FireRed and LeafGreen',
    key: '4',
  },
  {
    value: '5',
    text: 'Diamond, Pearl and Platinum',
    key: '5',
  },
  {
    value: '6',
    text: 'HeartGold and SoulSilver',
    key: '6',
  },
  {
    value: '7',
    text: 'Black and White',
    key: '7',
  },
  {
    value: '8',
    text: 'Black 2 and White 2',
    key: '8',
  },
  {
    value: '9',
    text: 'X and Y',
    key: '9',
  },
  {
    value: '10',
    text: 'Omega Ruby and Alpha Sapphire',
    key: '10',
  },
  {
    value: '11',
    text: 'Sun and Moon',
    key: '11',
  },
  {
    value: '12',
    text: 'Ultra Sun and Ultra Moon',
    key: '12',
  },
  {
    value: '13',
    text: 'Sword and Shield',
    key: '13',
  },
];

const DEFAULT_RULESET: TRule[] = [
  {
    content:
      'Any Pokémon that faints is considered dead, and must be released or put in the Pokémon Storage System permanently',
  },
  {
    content:
      'The player may only catch the first wild Pokémon encountered in each area, and none else. If the first wild Pokémon encountered faints or flees, there are no second chances. If the first encounter in the area is a double battle, the player is free to choose which of the two wild Pokémon they would like to catch but may only catch one of them.',
  },
  {
    content:
      'The player must nickname all of their Pokémon, for the sake of forming stronger emotional bonds',
  },
];

const HARDCORE_RULESET: TRule[] = [
  ...DEFAULT_RULESET,
  {
    content: 'Set mode must be enabled',
  },
  {
    content:
      "A pokemon's level may not exceed the highest level pokemon of the current gym leader/champion",
  },
  {
    content: 'No items are allowed in battles',
  },
];

const RULESETS = [
  {
    key: '1',
    value: '1',
    text: 'Nuzlocke',
  },
  {
    key: '2',
    value: '2',
    text: 'Hardcore Nuzlocke',
  },
];

export const INITIAL_STATE: Partial<AppState> = {
  badges: BADGES,
  darkMode: false,
  duplicates: false,
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
  },
  gamesList: GAMES,
  missing: false,
  newVersion: '1',
  nicknames: false,
  rules: { '1': DEFAULT_RULESET, '2': HARDCORE_RULESET },
  rulesets: RULESETS,
  selectedGame: null,
  selectedRuleset: '1',
  showAll: false,
  text: null,
};

export const PHYS_SPEC_SPLIT: string[] = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

export const GENDERS = [
  { key: '1', text: 'MALE', value: 'MALE' },
  { key: '2', text: 'FEMALE', value: 'FEMALE' },
  { key: '3', text: 'NEUTRAL', value: 'NEUTRAL' },
];
