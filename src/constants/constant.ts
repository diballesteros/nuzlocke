import { GenerationNum, ITEMS } from '@smogon/calc';
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

export const SOULLINK_RULESET: TRuleEntry[] = [
  ...DEFAULT_RULESET,
  {
    content:
      "Pokémon captured in one player's game are linked to another player's Pokémon. This means that each players' Pokémon are Soul Linked. For example, starter Pokémon are considered linked, and both players' encounter in each area is considered linked.",
    default: true,
    type: 'TEXT',
  },
  {
    content:
      "Once a Pokémon faints, the Soul Link Pokémon in the other player's game is also considered fainted and cannot be used.",
    default: true,
    type: 'TEXT',
  },
  {
    content:
      'If one player is unsuccessful in capturing a Pokémon on a specific route, the linked player must release a Pokémon captured on that route or not catch one.',
    default: true,
    type: 'TEXT',
  },
  {
    content:
      "If a Pokémon is placed in the PC, the linked Pokémon in the other player's game must also be placed in the PC.",
    default: true,
    type: 'TEXT',
  },
];

export const WEDLOCKE_RULESSET: TRuleEntry[] = [
  ...DEFAULT_RULESET,
  {
    content:
      'The player may have three male Pokémon and three female Pokémon in their party at any time. Each male Pokémon forms a pair with a female Pokémon, and the two may only switch with each other in battle',
    default: true,
    type: 'TEXT',
  },
  {
    content:
      'Genderless Pokémon can not be caught. If they must be caught for any reason, they must not be used.',
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
  'Soulocke': SOULLINK_RULESET,
  'Wedlocke': WEDLOCKE_RULESSET,
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

export const MAX_GAME = 13.1 as const;
export const FAIRY_GEN = 9 as const;

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
    '1': { badge: [], encounters: R_B_Y },
    '2': { badge: [], encounters: G_S_C },
    '3': { badge: [], encounters: R_S_E },
    '4': { badge: [], encounters: FR_LG },
    '5': { badge: [], encounters: D_P_PLAT },
    '6': { badge: [], encounters: HG_SS },
    '7': { badge: [], encounters: B_W },
    '8': { badge: [], encounters: B_W_2 },
    '9': { badge: [], encounters: X_Y },
    '10': { badge: [], encounters: OR_AS },
    '11': { badge: [], encounters: S_M },
    '12': { badge: [], encounters: US_UM },
    '13': { badge: [], encounters: SW_SH },
    '13.1': { badge: [], encounters: BD_SP },
  },
  gamesList: GAMES,
  missing: false,
  newVersion: '1',
  nicknames: false,
  notes: {},
  rules: DEFAULT_RULES,
  rulesets: null, // No longer used
  selectedGame: null,
  selectedRuleset: 'Nuzlocke',
  showAll: false,
  showAllTooltip: true,
  soulink: false,
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
  'Soulocke',
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

export const LANGUAGES = [
  { text: 'English', value: 'en' },
  { text: 'Español', value: 'es' },
  { text: 'Deutsch', value: 'de' },
];

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

export const getTypeCountParams = (
  gameId: string
): [types: { [key in Type]: number }, genRange: string] => {
  const types = { ...TYPE_COUNT };
  let genRange = 'Gen 6 - 8';

  if (GAME_GENERATION[gameId] === 1) {
    genRange = 'Gen 1';
    delete types.FAIRY;
    delete types.DARK;
    delete types.STEEL;
  } else if (GAME_GENERATION[gameId] >= 2 && GAME_GENERATION[gameId] <= 5) {
    genRange = 'Gen 2 - 5';
    delete types.FAIRY;
  }
  return [types, genRange];
};

export const D_STAT_COLOR: Record<string, string[]> = {
  'hp': ['#ffadad', '#A60000'],
  'atk': ['#ffb179', '#9C531F'],
  'def': ['#FAE078', '1px solid #A1871F'],
  'spa': ['#a8c2ff', '445E9C'],
  'spd': ['#81d756', '#4E8234'],
  'spe': ['#ffaac4', '#A13959'],
};

export const STAT_COLOR: Record<string, string[]> = {
  'hp': ['#940000', '#ffadad'],
  'atk': ['#6d3a16', '#ffb179'],
  'def': ['#4f4726', '#FAE078'],
  'spa': ['#334675', '445E9C'],
  'spd': ['#304f20', '#81d756'],
  'spe': ['#7a2b43', '#ffaac4'],
};

export const SPECIAL_NAMES: Record<string, string> = {
  'Nidoran♀': 'nidoran-f',
  'Nidoran♂': 'nidoran-m',
  "Farfetch'd": 'farfetchd',
  'Mr. Mime': 'mr-mime',
  'Mime Jr.': 'mime-jr',
  "Sirfetch'd": 'sirfetchd',
  'Mr. Rime': 'mr-rime',
  'Flabébé': 'flabebe',
  'Type: Null': 'type-null',
  'Tapu Koko': 'tapu-koko',
  'Tapu Lele': 'tapu-lele',
  'Tapu Bulu': 'tapu-bulu',
  'Tapu Fini': 'tapu-fini',
  'Rattata (Alolan)': 'rattata-alola',
  'Raticate (Alolan)': 'raticate-alola',
  'Raichu (Alolan)': 'raichu-alola',
  'Sandshrew (Alolan)': 'sandshrew-alola',
  'Sandslash (Alolan)': 'sandslash-alola',
  'Vulpix (Alolan)': 'vulpix-alola',
  'Ninetales (Alolan)': 'ninetales-alola',
  'Diglett (Alolan)': 'diglett-alola',
  'Dugtrio (Alolan)': 'dugtrio-alola',
  'Meowth (Alolan)': 'meowth-alola',
  'Persian (Alolan)': 'persian-alola',
  'Geodude (Alolan)': 'geodude-alola',
  'Graveler (Alolan)': 'graveler-alola',
  'Golem (Alolan)': 'golem-alola',
  'Grimer (Alolan)': 'grimer-alola',
  'Muk (Alolan)': 'muk-alola',
  'Marowak (Alolan)': 'marowak-alola',
  'Exeggutor (Alolan)': 'exeggutor-alola',
  'Meowth (Galarian)': 'meowth-galar',
  'Persian (Galarian)': 'persian-galar',
  'Ponyta (Galarian)': 'ponyta-galar',
  'Rapidash (Galarian)': 'rapidash-galar',
  'Slowpoke (Galarian)': 'slowpoke-galar',
  'Slowbro (Galarian)': 'slowbro-galar',
  "Farfetch'd (Galarian)": 'farfetchd-galar',
  'Weezing (Galarian)': 'weezing-galar',
  'Mr. Mime (Galarian)': 'mr-mime-galar',
  'Articuno (Galarian)': 'articuno-galar',
  'Zapdos (Galarian)': 'zapdos-galar',
  'Moltres (Galarian)': 'moltres-galar',
  'Slowking (Galarian)': 'slowking-galar',
  'Corsola (Galarian)': 'corsola-galar',
  'Zigzagoon (Galarian)': 'zigzagoon-galar',
  'Linoone (Galarian)': 'linoone-galar',
  'Darumaka (Galarian)': 'darumaka-galar',
  'Darmanitan (Galarian)': 'darmanitan-galar',
  'Stunfisk (Galarian)': 'stunfisk-galar',
  'Yamask (Galarian)': 'yamask-galar',
};

export const SMOGON_NAMES: Record<string, string> = {
  'Aegislash': 'Aegislash-Both',
  'Nidoran♀': 'Nidoran-F',
  'Nidoran♂': 'Nidoran-M',
  'Rattata (Alolan)': 'Rattata-Alola',
  'Raticate (Alolan)': 'Raticate-Alola',
  'Raichu (Alolan)': 'Raichu-Alola',
  'Sandshrew (Alolan)': 'Sandshrew-Alola',
  'Sandslash (Alolan)': 'Aandslash-Alola',
  'Vulpix (Alolan)': 'Vulpix-Alola',
  'Ninetales (Alolan)': 'Ninetales-Alola',
  'Diglett (Alolan)': 'Diglett-Alola',
  'Dugtrio (Alolan)': 'Dugtrio-Alola',
  'Meowth (Alolan)': 'Meowth-Alola',
  'Persian (Alolan)': 'Persian-Alola',
  'Geodude (Alolan)': 'geodude-Alola',
  'Graveler (Alolan)': 'Graveler-Alola',
  'Golem (Alolan)': 'Golem-Alola',
  'Grimer (Alolan)': 'Grimer-Alola',
  'Muk (Alolan)': 'Muk-Alola',
  'Marowak (Alolan)': 'Marowak-Alola',
  'Exeggutor (Alolan)': 'Exeggutor-Alola',
  'Meowth (Galarian)': 'Meowth-Galar',
  'Persian (Galarian)': 'Persian-Galar',
  'Ponyta (Galarian)': 'Ponyta-Galar',
  'Rapidash (Galarian)': 'Rapidash-Galar',
  'Slowpoke (Galarian)': 'Slowpoke-Galar',
  'Slowbro (Galarian)': 'Slowbro-Galar',
  "Farfetch'd (Galarian)": "Farfetch'd-Galar",
  'Weezing (Galarian)': 'Weezing-Galar',
  'Mr. Mime (Galarian)': 'Mr. Mime-Galar',
  'Articuno (Galarian)': 'Articuno-Galar',
  'Zapdos (Galarian)': 'Zapdos-Galar',
  'Moltres (Galarian)': 'Moltres-Galar',
  'Slowking (Galarian)': 'Slowking-Galar',
  'Corsola (Galarian)': 'Corsola-Galar',
  'Zigzagoon (Galarian)': 'Zigzagoon-Galar',
  'Linoone (Galarian)': 'Linoone-Galar',
  'Darumaka (Galarian)': 'Darumaka-Galar',
  'Darmanitan (Galarian)': 'Darmanitan-Galar',
  'Stunfisk (Galarian)': 'Stunfisk-Galar',
};

export const EXTRA_ITEMS = ['Amulet Coin', 'Soothe Bell'];

export const MY_ITEMS = [
  ...[...new Set(ITEMS[8])].filter((smogonItem) => smogonItem.substring(0, 2) !== 'TR'),
  ...EXTRA_ITEMS,
];

export const getSmogonItemName = (item: string): string => {
  if (item === "King's Rock") {
    return 'kings-rock';
  }
  return item?.toLowerCase()?.replaceAll(' ', '-');
};
