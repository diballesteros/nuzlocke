export interface AppState {
  badges: TBadgeDictionary;
  darkMode: boolean;
  duplicates: boolean;
  games: Games;
  gamesList: TGame[];
  missing: boolean;
  newVersion: string;
  nicknames: boolean;
  rules: TRulesetDictionary;
  rulesets: TRuleset[];
  selectedGame: TGame;
  selectedRuleset: string;
  showAll: boolean;
  text: string;
  typeModal: Type;
  addEncounter: (newLocation: string) => void;
  addGame: (newGame: string) => void;
  addRule: (entry: TRuleEntry) => void;
  addRuleset: (newRuleset: string) => void;
  changeDetails: (
    encounterId: number,
    level: number,
    metLevel: number,
    gender: string,
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
  clearEncounter: (encounterId: number) => void;
  closeTypeModal: () => void;
  deleteGame: () => void;
  deleteEncounter: (encounterId: number) => void;
  deleteRule: (ruleIndex: number) => void;
  deleteRuleset: () => void;
  editBadge: (newBadge: string, i: number) => void;
  editRule: (newRule: TRuleContent, i: number) => void;
  importState: (newAppState: Partial<AppState>) => void;
  removeNew: () => void;
  reorderRule: (destinationId: number, rule: TRuleEntry, sourceId: number) => void;
  resetAll: () => void;
  resetBadges: (gameKey?: string) => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
  showTypeModal: (type: Type) => void;
  toggleMissing: () => void;
  toggleMode: () => void;
  toggleNickname: () => void;
  toggleShowAll: () => void;
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

export type TBadge = {
  id: number;
  levelCap: number | string;
  name: string;
  src: string;
};

export type TEncounter = {
  details?: PokemonDetail;
  filter?: string[];
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
  gender?: string;
  id: number;
  item?: string;
  level: number;
  metLevel?: number;
  moves: number[];
  nature?: string;
}

export type TypeObj = {
  [key in Type]: number;
};

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
