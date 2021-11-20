import { GenerationNum } from '@smogon/calc';
import BADGES from 'constants/badges';
import { DEFAULT_VALUES } from 'constants/calculator';
import B_W from 'constants/locations/B_W';
import B_W_2 from 'constants/locations/B_W_2';
import BD_SP from 'constants/locations/BD_SP';
import D_P_PLAT from 'constants/locations/D_P_PLAT';
import FR_LG from 'constants/locations/FR_LG';
import G_S_C from 'constants/locations/G_S_C';
import HG_SS from 'constants/locations/HG_SS';
import OR_AS from 'constants/locations/OR_AS';
import R_B_Y from 'constants/locations/R_B_Y';
import R_S_E from 'constants/locations/R_S_E';
import S_M from 'constants/locations/S_M';
import SW_SH from 'constants/locations/SW_SH';
import US_UM from 'constants/locations/US_UM';
import X_Y from 'constants/locations/X_Y';
import {
  AppState,
  TEncounter,
  TGame,
  TRule,
  TRuleContent,
  TRuleEntry,
  TRulesetDictionary,
  Type,
} from 'constants/types';

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
  {
    value: '13.1',
    text: 'Brilliant Diamond and Shining Pearl',
    key: '13.1',
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

export const GAME_GENERATION: Record<string, GenerationNum> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 3,
  '5': 4,
  '6': 4,
  '7': 5,
  '8': 5,
  '9': 6,
  '10': 6,
  '11': 7,
  '12': 7,
  '13': 8,
  '13.1': 8,
};

export const MAX_GAME = 13.1;

export const INITIAL_STATE: Partial<AppState> = {
  badges: BADGES,
  calcs: {
    '1': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['1'], pokemon1: 1, pokemon2: 1 },
    },
    '2': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['2'], pokemon1: 1, pokemon2: 1 },
    },
    '3': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['3'], pokemon1: 1, pokemon2: 1 },
    },
    '4': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['4'], pokemon1: 1, pokemon2: 1 },
    },
    '5': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['5'], pokemon1: 1, pokemon2: 1 },
    },
    '6': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['6'], pokemon1: 1, pokemon2: 1 },
    },
    '7': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['7'], pokemon1: 1, pokemon2: 1 },
    },
    '8': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['8'], pokemon1: 1, pokemon2: 1 },
    },
    '9': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['9'], pokemon1: 1, pokemon2: 1 },
    },
    '10': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['10'], pokemon1: 1, pokemon2: 1 },
    },
    '11': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['11'], pokemon1: 1, pokemon2: 1 },
    },
    '12': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['12'], pokemon1: 1, pokemon2: 1 },
    },
    '13': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['13'], pokemon1: 1, pokemon2: 1 },
    },
    '13.1': {
      form: { ...DEFAULT_VALUES, calculatorGen: GAME_GENERATION['13.1'], pokemon1: 1, pokemon2: 1 },
    },
  },
  darkMode: false,
  duplicates: false,
  games: {
    '1': { badge: null, encounters: R_B_Y },
    '2': { badge: null, encounters: G_S_C },
    '3': { badge: null, encounters: R_S_E },
    '4': { badge: null, encounters: FR_LG },
    '5': { badge: null, encounters: D_P_PLAT },
    '6': { badge: null, encounters: HG_SS },
    '7': { badge: null, encounters: B_W },
    '8': { badge: null, encounters: B_W_2 },
    '9': { badge: null, encounters: X_Y },
    '10': { badge: null, encounters: OR_AS },
    '11': { badge: null, encounters: S_M },
    '12': { badge: null, encounters: US_UM },
    '13': { badge: null, encounters: SW_SH },
    '13.1': { badge: null, encounters: BD_SP },
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
  suggestions: true,
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
    '13.1': { ...INITIAL_SUMMARY },
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

export const GAME_KEY_DICTIONARY: { [key in string]: TEncounter[] } = {
  '1': R_B_Y,
  '2': G_S_C,
  '3': R_S_E,
  '4': FR_LG,
  '5': D_P_PLAT,
  '6': HG_SS,
  '7': B_W,
  '8': B_W_2,
  '9': X_Y,
  '10': OR_AS,
  '11': S_M,
  '12': US_UM,
  '13': SW_SH,
  '13.1': BD_SP,
};

export const GENDERS = [
  { key: '1', text: 'MALE', value: 'MALE' },
  { key: '2', text: 'FEMALE', value: 'FEMALE' },
  { key: '3', text: 'NEUTRAL', value: 'NEUTRAL' },
];

export const TYPE_COUNT: { [key in Type]: number } = {
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

export const GENERATION_SELECT = [
  { key: '1', text: '1', value: 1 },
  { key: '2', text: '2', value: 2 },
  { key: '3', text: '3', value: 3 },
  { key: '4', text: '4', value: 4 },
  { key: '5', text: '5', value: 5 },
  { key: '6', text: '6', value: 6 },
  { key: '7', text: '7', value: 7 },
  { key: '8', text: '8', value: 8 },
];

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

export const RULE_ALERTS: { [key: string]: string } = {
  'DUPE': 'Duplicate pokémon are not allowed',
  'FORBIDDEN GEN': 'Pokémon from this generation are not allowed',
  'OVERLEVELED': 'Max level set has been exceeded',
  'FORBIDDEN TYPE': 'Pokémon of this type are not allowed',
  'TEAM OVER 6': 'Maximum amount of pokémon per team is 6',
};

export const getTypeParams = (gameId: string): [types: Type[], genRange: string] => {
  let types = [...TYPES];
  let genRange = 'Gen 6 - 8';

  if (GAME_GENERATION[gameId] === 1) {
    genRange = 'Gen 1';
    types = types.filter((gen1) => gen1 !== 'DARK' && gen1 !== 'FAIRY' && gen1 !== 'STEEL');
  } else if (GAME_GENERATION[gameId] >= 2 && GAME_GENERATION[gameId] <= 5) {
    genRange = 'Gen 2 - 5';
    types = types.filter((gen2_5) => gen2_5 !== 'FAIRY');
  }
  return [types, genRange];
};
