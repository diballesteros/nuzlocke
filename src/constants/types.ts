export interface TrackerState {
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
}

export interface AppState extends TrackerState {
  addEncounter: (newLocation: string) => void;
  addGame: (newGame: string) => void;
  addRule: (newRule: string) => void;
  addRuleset: (newRuleset: string) => void;
  changeDupe: () => void;
  changePokemon: (encounterId: number, pokemon: TPokemon) => void;
  changeNickname: (encounterId: number, nickname: string) => void;
  changeRuleset: (rulesetId: string) => void;
  changeStatus: (encounterId: number, status: TStatus) => void;
  clearEncounter: (encounterId: number) => void;
  deleteGame: () => void;
  deleteEncounter: (encounterId: number) => void;
  deleteRule: (ruleIndex: number) => void;
  deleteRuleset: () => void;
  editBadge: (newBadge: string, i: number) => void;
  editRule: (newRule: string, i: number) => void;
  importState: (newAppState: Partial<AppState>) => void;
  removeNew: () => void;
  reorderRule: (destinationId: number, rule: TRule, sourceId: number) => void;
  resetAll: () => void;
  resetBadges: (gameKey?: string) => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
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
  filter?: string[];
  id: number;
  location: string;
  nickname?: string;
  pokemon: TPokemon;
  status: TStatus;
};

export interface TPokemon {
  dualType?: Type;
  evolve?: unknown;
  key?: string;
  image: string;
  text: string;
  type?: Type;
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

export type TRulesetDictionary = { [key: string]: TRule[] };

export type TRuleset = {
  key: string;
  text: string;
  value: string;
};

export type TRule = {
  content: string;
};

type TDetailClassification = 'GYM' | 'POKEMON';

export type TDetail = {
  content: PokemonDetail[];
  name: string;
  game: string;
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

export type TypeColor = {
  [key in Type]: string;
};

type Gender = 'MALE' | 'FEMALE' | 'NEUTRAL';

export type Move = {
  accuracy: string;
  category: 'Physical' | 'Special' | 'Status' | '???';
  contest: string;
  gen: string;
  name: string;
  id: number;
  power: string;
  pp: string;
  type: Type;
};

export interface PokemonDetail {
  ability?: string;
  gender?: Gender;
  id: number;
  item?: string;
  level: number;
  moves: number[];
  nature?: string;
  notes?: string;
}
