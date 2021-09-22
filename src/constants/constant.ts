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
import {
  AppState,
  TGame,
  TRule,
  TRuleContent,
  TRuleEntry,
  TRulesetDictionary,
  Type,
  TypeObj,
} from 'constants/types';
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

const DEFAULT_RULESET: TRuleEntry[] = [
  {
    content:
      'Any Pokémon that faints is considered dead, and must be released or put in the Pokémon Storage System permanently',
    default: true,
    type: 'TEXT',
  },
  {
    content:
      'The player may only catch the first wild Pokémon encountered in each area, and none else. If the first wild Pokémon encountered faints or flees, there are no second chances. If the first encounter in the area is a double battle, the player is free to choose which of the two wild Pokémon they would like to catch but may only catch one of them.',
    default: true,
    type: 'TEXT',
  },
  {
    content:
      'The player must nickname all of their Pokémon, for the sake of forming stronger emotional bonds',
    default: true,
    type: 'TEXT',
  },
];

const HARDCORE_RULESET: TRuleEntry[] = [
  ...DEFAULT_RULESET,
  {
    content: 'Set mode must be enabled',
    default: true,
    type: 'TEXT',
  },
  {
    content:
      "A pokemon's level may not exceed the highest level pokemon of the current gym leader/champion",
    default: true,
    type: 'TEXT',
  },
  {
    content: 'No items are allowed in battles',
    default: true,
    type: 'TEXT',
  },
];

const EGGLOCKE_RULESET: TRuleEntry[] = [
  ...DEFAULT_RULESET,
  {
    content: 'Any Pokemon you capture must be traded with user-generated eggs',
    default: true,
    type: 'TEXT',
  },
];

const WONDERLOCKE_RULESET: TRuleEntry[] = [
  ...DEFAULT_RULESET,
  {
    content: 'Any Pokemon you capture must be traded with the Wonder Trade feature',
    default: true,
    type: 'TEXT',
  },
];

const GENERATION_RULESET: TRuleEntry[] = [
  ...DEFAULT_RULESET,
  {
    content: 'You must complete a run of all 7 generations in any order you choose',
    default: true,
    type: 'TEXT',
  },
  {
    content:
      'At the end of every game, you must take the offspring of the survivors of the Elite 4 into the next one. A brand new Nuzlocke will begin with the offspring of your pokémon from your old party',
    default: true,
    type: 'TEXT',
  },
];

export const DEFAULT_RULES: TRulesetDictionary = {
  'Nuzlocke': DEFAULT_RULESET,
  'Hardcore': HARDCORE_RULESET,
  'Egglocke': EGGLOCKE_RULESET,
  'Wonderlocke': WONDERLOCKE_RULESET,
  'Genlocke': GENERATION_RULESET,
};

export const INITIAL_SUMMARY = {
  boxed: true,
  description: '',
  encounters: true,
  fainted: true,
  rules: true,
  showDescription: true,
  stats: true,
  status: 0,
  title: 'Nuzlocke Run',
};

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
  rules: DEFAULT_RULES,
  rulesets: null, // No longer used
  selectedGame: null,
  selectedRuleset: 'Nuzlocke',
  showAll: false,
  summary: {
    '1': { ...INITIAL_SUMMARY },
    '2': { ...INITIAL_SUMMARY },
    '3': { ...INITIAL_SUMMARY },
    '4': { ...INITIAL_SUMMARY },
    '5': { ...INITIAL_SUMMARY },
    '6': { ...INITIAL_SUMMARY },
    '7': { ...INITIAL_SUMMARY },
    '8': { ...INITIAL_SUMMARY },
    '9': { ...INITIAL_SUMMARY },
    '10': { ...INITIAL_SUMMARY },
    '11': { ...INITIAL_SUMMARY },
    '12': { ...INITIAL_SUMMARY },
    '13': { ...INITIAL_SUMMARY },
  },
  team: {},
  text: null,
};

export const PHYS_SPEC_SPLIT: string[] = ['1', '2', '3'];

export const DEFAULT_RULESET_NAMES = [
  'Nuzlocke',
  'Hardcore',
  'Egglocke',
  'Wonderlocke',
  'Genlocke',
  'Hardcore Nuzlocke',
];

export const getRuleContent = (content: TRuleContent, type: TRule): string => {
  switch (type) {
    case 'TYPE':
      return `Allowed types: ${(content as string[])?.join(', ')}`;
    case 'GENERATION':
      return `Allowed generations: ${(content as string[])?.join(', ')}`;
    case 'LEVEL':
      return `Max level ${content}`;
    case 'TEXT':
    default:
      return content as string;
  }
};

export const GENDERS = [
  { key: '1', text: 'MALE', value: 'MALE' },
  { key: '2', text: 'FEMALE', value: 'FEMALE' },
  { key: '3', text: 'NEUTRAL', value: 'NEUTRAL' },
];

export const TYPE_COUNT: TypeObj = {
  'NORMAL': 0,
  'FIRE': 0,
  'WATER': 0,
  'GRASS': 0,
  'ELECTRIC': 0,
  'ICE': 0,
  'POISON': 0,
  'FIGHTING': 0,
  'GROUND': 0,
  'FLYING': 0,
  'PSYCHIC': 0,
  'BUG': 0,
  'ROCK': 0,
  'GHOST': 0,
  'DARK': 0,
  'DRAGON': 0,
  'STEEL': 0,
  'FAIRY': 0,
};

export const SUM_STATUS = [
  {
    key: 'ongoing',
    text: 'ONGOING',
    value: 0,
  },
  {
    key: 'complete',
    text: 'COMPLETE',
    value: 1,
  },
  {
    key: 'FAILED',
    text: 'FAILED',
    value: 2,
  },
];

export const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export const TYPES: Type[] = [
  'NORMAL',
  'FIRE',
  'WATER',
  'GRASS',
  'ELECTRIC',
  'ICE',
  'POISON',
  'FIGHTING',
  'GROUND',
  'FLYING',
  'PSYCHIC',
  'BUG',
  'ROCK',
  'GHOST',
  'DARK',
  'DRAGON',
  'STEEL',
  'FAIRY',
];
