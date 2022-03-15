import { GenerationNum } from '@smogon/calc';
import { StatusName } from '@smogon/calc/dist/data/interface';

export interface AppState {
  badges: TBadgeDictionary;
  calcs: TCalcDictionary;
  customBadges: TCustomBadgeDictionary;
  customStatuses: TStatus[];
  darkMode: boolean;
  duplicates: boolean;
  games: Games;
  gamesList: TGame[];
  gens: number[];
  language: TLanguage;
  missing: boolean;
  newVersion: string;
  nicknames: boolean;
  notes: TNotesDictionary;
  rules: TRulesetDictionary;
  rulesets: TRuleset[];
  selectedGame: TGame;
  selectedRuleset: string;
  soulink: boolean;
  showAll: boolean;
  suggestions: boolean;
  team: TTeamDictionary;
  text: string;
  typeModal: Type;
  types: Type[];
  addCustomBadge: () => void;
  addCustomStatus: (status: string) => void;
  addEncounter: (newLocation: string) => void;
  addGame: (newGame: string, templateKey?: string) => void;
  addRule: (entry: TRuleEntry) => void;
  addRuleset: (newRuleset: string) => void;
  addTeamMember: (pokemonId: number) => void;
  changeDetails: (
    encounterId: number,
    level: number,
    metLevel: number,
    gender: Gender,
    ability: string,
    nature: string,
    item: string,
    faint: string,
    moveOne: number,
    moveTwo: number,
    moveThree: number,
    moveFour: number,
    shiny: boolean,
    ivhp: number,
    ivatk: number,
    ivdef: number,
    ivspatk: number,
    ivspdef: number,
    ivspeed: number,
    evhp: number,
    evatk: number,
    evdef: number,
    evspatk: number,
    evspdef: number,
    evspeed: number,
    soulink: number
  ) => void;
  changeDupe: () => void;
  changeLevel: (encounterId: number, increase: boolean) => void;
  changeNature: (encounterId: number, nature: string) => void;
  changeNickname: (encounterId: number, nickname: string) => void;
  changeNotes: (text: string) => void;
  changePokemon: (encounterId: number, pokemonId: number) => void;
  changePreviousStatus: (encounterId: number, status: TStatus) => void;
  changeRuleset: (rulesetId: string) => void;
  changeStatus: (encounterId: number, status: TStatus) => void;
  changeSummaryDescription: (desc: string) => void;
  changeSummaryStatus: (status: number) => void;
  changeSummaryTitle: (title: string) => void;
  changeTeamMember: (teamIndex: number, detail: PokemonDetail) => void;
  clearEncounter: (encounterId: number) => void;
  closeTypeModal: () => void;
  deleteCustomBadge: (index: number) => void;
  deleteCustomStatus: (index: number) => void;
  deleteGame: () => void;
  deleteEncounter: (encounterId: number) => void;
  deleteRule: (ruleIndex: number) => void;
  deleteRuleset: () => void;
  deleteTeamMember: (teamIndex: number) => void;
  editBadge: (newBadge: string, i: number) => void;
  editCustomBadge: (newBadge: string, i: number) => void;
  editRule: (newRule: TRuleContent, i: number) => void;
  exportTeamMember: (detail: PokemonDetail) => void;
  exportToGame: (encounter: TEncounter, game: string, location: string) => void;
  importState: (newAppState: Partial<AppState>) => void;
  massImport: (encounters: TEncounter[]) => void;
  removeNew: () => void;
  reorderRule: (destinationId: number, rule: TRuleEntry, sourceId: number) => void;
  resetAll: () => void;
  resetBadges: (gameKey?: string) => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
  setDefaultCalculator: () => void;
  setDefaultSummary: () => void;
  setGens: (genId: number) => void;
  setLanguage: (language: TLanguage) => void;
  setTypes: (typeId: Type) => void;
  showTypeModal: (type: Type) => void;
  summary: TSummaryDictionary;
  toggleMissing: () => void;
  toggleMode: () => void;
  toggleNickname: () => void;
  toggleShowAll: () => void;
  toggleSoulink: () => void;
  toggleSuggestions: () => void;
  toggleSummarySetting: (property: keyof TSummaryBasic) => void;
  updateDefaultValues: (values: Partial<TCalculatorForm>) => void;
}

export type Games = { [key: string]: TrackData };

export type TrackData = {
  badge: number[];
  encounters: TEncounter[];
};

export type TGame = {
  value: string;
  text: string;
  key: string;
};

export type TLevelCaps = { [key: string]: LevelCap[] };

export type LevelCap = {
  value: string;
  text: string;
  key: string;
};

export type TLevelCapDictionary = {
  [key: string]: string[];
};

export type TBadgeDictionary = {
  [key: string]: TBadge[];
};

export type TBadgeImages = {
  [key: string]: { src: string }[];
};

export type TCustomBadgeDictionary = {
  [key: string]: (number | string)[];
};

export type TTeamDictionary = {
  [key: string]: PokemonDetail[];
};

export type TSummaryDictionary = {
  [key: string]: TSummary;
};

export type TCalcState = {
  form: TCalculatorForm;
};

export type TCalcDictionary = {
  [key: string]: TCalcState;
};

export type TBadge = {
  id: number;
  levelCap: number | string;
  name: string;
};

export type TEncounter = {
  details?: PokemonDetail;
  filter?: string[];
  filterKey?: string;
  id: number;
  location: string;
  nickname?: string;
  pokemon: number;
  previousStatus?: TStatus;
  status: TStatus;
};

export interface TPokemon {
  dualtype?: Type;
  evolve?: number[];
  generation: number;
  key?: string;
  previousDualType?: Type;
  previousType?: Type;
  text: string;
  type: Type;
  value: number;
}

export type TStatus = {
  icon: string;
  key: string;
  text: string;
  value: number;
};

export type TLocation = {
  name: string;
};
export type TNotesDictionary = { [key: string]: string };

export type TRulesetDictionary = { [key: string]: TRuleEntry[] };

export type TRuleset = {
  key: string;
  text: string;
  value: string;
};

export type TRuleEntry = {
  content: TRuleContent;
  default: boolean;
  type: TRule;
};

export type TRuleContent = string | string[] | number | number[];

export type TRule = 'TEXT' | 'TYPE' | 'GENERATION' | 'LEVEL';

type TDetailClassification =
  | 'GYM'
  | 'TRIAL'
  | 'DYNAMAX'
  | 'REMATCH'
  | 'RIVAL'
  | 'EVIL_ORGANIZATION';

export interface TSummary extends TSummaryBasic {
  description: string;
  status: number;
  title: string;
}

export interface TSummaryBasic {
  boxed: boolean;
  encounters: boolean;
  fainted: boolean;
  rules: boolean;
  stats: boolean;
  showDescription: boolean;
}

export type TDetail = {
  content: PokemonDetail[];
  name: string;
  game: string;
  rematch?: PokemonDetail[];
  type: TDetailClassification;
};

export type Type =
  | 'NORMAL'
  | 'FIRE'
  | 'WATER'
  | 'GRASS'
  | 'ELECTRIC'
  | 'ICE'
  | 'POISON'
  | 'FIGHTING'
  | 'GROUND'
  | 'FLYING'
  | 'PSYCHIC'
  | 'BUG'
  | 'ROCK'
  | 'GHOST'
  | 'DARK'
  | 'DRAGON'
  | 'STEEL'
  | 'FAIRY';

export type TLanguage = 'en' | 'es' | 'de';

type Category = 'Physical' | 'Special' | 'Status' | '???';

export type TypeColor = {
  [key in Type]: string;
};

export type TypeIcon = {
  [key in Type]: React.ReactNode;
};

export type CategoryColor = {
  [key in Category]: string;
};

export type Gender = 'MALE' | 'FEMALE' | 'NEUTRAL';

export type TNature = {
  decreased: string;
  increased: string;
  key: string;
  nature: string;
  value: string;
  text: string;
};

export type TMove = {
  accuracy: string;
  category: Category;
  contest: string;
  gen: number;
  name: string;
  id: number;
  power: string;
  pp: string;
  type: Type;
};

export interface PokemonDetail {
  ability?: string;
  faint?: string;
  gender?: Gender;
  id: number;
  item?: string;
  level: number;
  metLevel?: number;
  moves: number[];
  nature?: string;
  shiny?: boolean;
  soulink?: number;
  ivatk?: number;
  ivdef?: number;
  ivhp?: number;
  ivspatk?: number;
  ivspdef?: number;
  ivspeed?: number;
  evhp?: number;
  evatk?: number;
  evdef?: number;
  evspatk?: number;
  evspdef?: number;
  evspeed?: number;
}

export type TReleaseNotes = { name: string; date: number; notes: TReleaseNote[] }[];

export type TReleaseNote = {
  description: string;
  type: TReleaseGroup;
};

export type TReleaseGroup = 'UPDATE' | 'FEATURE' | 'FIX';

export type TEffectiveness = {
  [key in Type]: {
    'Has no effect on': Type[];
    'Immune to': Type[];
    'Super effective against': Type[];
    'Not very effective against': Type[];
    'Weak against': Type[];
    'Resists': Type[];
  };
};

export type TGenerationEffects = {
  [key: string]: TEffectiveness;
};

export interface TCalculatorFields {
  cannonade: boolean;
  isAuroraVeil: boolean;
  isBattery: boolean;
  isDynamaxed: boolean;
  isForesight: boolean;
  isFriendGuard: boolean;
  isHelpingHand: boolean;
  isLightScreen: boolean;
  isProtected: boolean;
  isReflect: boolean;
  isSeeded: boolean;
  isSR: boolean;
  isSwitching: boolean;
  isTailwind: boolean;
  spikes: number;
  steelsurge: boolean;
  vinelash: boolean;
  volcalith: boolean;
  wildfire: boolean;
}

export interface TCalculatorMoves {
  move1_: number;
  move1_crit: boolean;
  move1_z: boolean;
  move2_: number;
  move2_crit: boolean;
  move2_z: boolean;
  move3_: number;
  move3_crit: boolean;
  move3_z: boolean;
  move4_: number;
  move4_crit: boolean;
  move4_z: boolean;
}

interface TCalculatorStats extends TCalculatorFields, TCalculatorMoves {
  ability: string;
  currenthp: number;
  dvatk: number;
  dvdef: number;
  dvspc: number;
  dvspeed: number;
  evatk: number;
  evdef: number;
  evhp: number;
  evspatk: number;
  evspdef: number;
  evspeed: number;
  gender: Gender;
  item: string;
  ivatk: number;
  ivdef: number;
  ivhp: number;
  ivspatk: number;
  ivspdef: number;
  ivspeed: number;
  level: number;
  modatk: number;
  moddef: number;
  modspatk: number;
  modspdef: number;
  modspeed: number;
  pokemon: number;
  nature: string;
  status: StatusName | 'none';
}

type TSplitCalculator<T> = {
  [Property in keyof T as `${Property & string}${1 | 2}`]: T[Property];
};

export type TFirstSplit = {
  [Property in keyof TCalculatorStats as `${Property & string}1`]: TCalculatorStats[Property];
};

export type TSecondSplit = {
  [Property in keyof TCalculatorStats as `${Property & string}2`]: TCalculatorStats[Property];
};

export type TCalculatorMain = {
  calculatorGen: GenerationNum;
  gameType: 'Singles' | 'Doubles';
  isGravity: boolean;
  terrain: 'Electric' | 'Grassy' | 'Misty' | 'Psychic' | 'None';
  weather:
    | 'None'
    | 'Hail'
    | 'Harsh Sunshine'
    | 'Heavy Rain'
    | 'Rain'
    | 'Sand'
    | 'Strong Winds'
    | 'Sun'
    | undefined;
};

export type TCalculatorForm = TSplitCalculator<TCalculatorStats> & TCalculatorMain;
