import { GenerationNum } from '@smogon/calc';

export interface AppState {
  badges: TBadgeDictionary;
  calcs: TCalcDictionary;
  darkMode: boolean;
  duplicates: boolean;
  games: Games;
  gamesList: TGame[];
  gens: number[];
  missing: boolean;
  newVersion: string;
  nicknames: boolean;
  rules: TRulesetDictionary;
  rulesets: TRuleset[];
  selectedGame: TGame;
  selectedRuleset: string;
  showAll: boolean;
  team: TTeamDictionary;
  text: string;
  typeModal: Type;
  types: Type[];
  addEncounter: (newLocation: string) => void;
  addGame: (newGame: string) => void;
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
    moveFour: number
  ) => void;
  changeDupe: () => void;
  changePokemon: (encounterId: number, pokemonId: number) => void;
  changeNickname: (encounterId: number, nickname: string) => void;
  changeRuleset: (rulesetId: string) => void;
  changeStatus: (encounterId: number, status: TStatus) => void;
  changeSummaryDescription: (desc: string) => void;
  changeSummaryStatus: (status: number) => void;
  changeSummaryTitle: (title: string) => void;
  changeTeamMember: (teamIndex: number, detail: PokemonDetail) => void;
  clearEncounter: (encounterId: number) => void;
  closeTypeModal: () => void;
  deleteGame: () => void;
  deleteEncounter: (encounterId: number) => void;
  deleteRule: (ruleIndex: number) => void;
  deleteRuleset: () => void;
  deleteTeamMember: (teamIndex: number) => void;
  editBadge: (newBadge: string, i: number) => void;
  editRule: (newRule: TRuleContent, i: number) => void;
  exportTeamMember: (detail: PokemonDetail) => void;
  importState: (newAppState: Partial<AppState>) => void;
  massImport: (encounters: TEncounter[]) => void;
  removeNew: () => void;
  reorderRule: (destinationId: number, rule: TRuleEntry, sourceId: number) => void;
  resetAll: () => void;
  resetBadges: (gameKey?: string) => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
  setDefaultSummary: () => void;
  setGens: (genId: number) => void;
  setTypes: (typeId: Type) => void;
  showTypeModal: (type: Type) => void;
  summary: TSummaryDictionary;
  toggleMissing: () => void;
  toggleMode: () => void;
  toggleNickname: () => void;
  toggleShowAll: () => void;
  toggleSummarySetting: (property: keyof TSummaryBasic) => void;
  updateDefaultValues: (values: Partial<TCalculatorForm>) => void;
}

declare global {
  interface Navigator {
    canShare: (stuff: unknown) => boolean;
  }
}

export type Games = { [key: string]: TrackData };

export type TrackData = {
  badge: number;
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
  src: string;
};

export type TEncounter = {
  details?: PokemonDetail;
  filter?: string[];
  filterKey?: string;
  id: number;
  location: string;
  nickname?: string;
  pokemon: number;
  status: TStatus;
};

export interface TPokemon {
  dualtype?: Type;
  evolve?: number[];
  generation: number;
  key?: string;
  image: string;
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

type TDetailClassification = 'GYM' | 'TRIAL' | 'DYNAMAX' | 'REMATCH';

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

export interface TCalculatorForm {
  calculatorGen: GenerationNum;
  pokemon1: number;
  level1: number;
  gender1: Gender;
  evatk1: number;
  evdef1: number;
  evhp1: number;
  evspatk1: number;
  evspdef1: number;
  evspeed1: number;
  ivatk1: number;
  ivdef1: number;
  ivhp1: number;
  ivspatk1: number;
  ivspdef1: number;
  ivspeed1: number;
  modatk1: number;
  moddef1: number;
  modspatk1: number;
  modspdef1: number;
  modspeed1: number;
  nature1: string;
  ability1: string;
  item1: string;
  status1: string;
  currenthp1: number;
  poke1move1?: number;
  poke1move2?: number;
  poke1move3?: number;
  poke1move4?: number;
  pokemon2: number;
  level2: number;
  gender2: Gender;
  evatk2: number;
  evdef2: number;
  evhp2: number;
  evspatk2: number;
  evspdef2: number;
  evspeed2: number;
  ivatk2: number;
  ivdef2: number;
  ivhp2: number;
  ivspatk2: number;
  ivspdef2: number;
  ivspeed2: number;
  modatk2: number;
  moddef2: number;
  modspatk2: number;
  modspdef2: number;
  modspeed2: number;
  nature2: string;
  ability2: string;
  item2: string;
  status2: string;
  currenthp2: number;
  poke2move1?: number;
  poke2move2?: number;
  poke2move3?: number;
  poke2move4?: number;
}
