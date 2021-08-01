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
  resetBadges: () => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
  toggleMissing: () => void;
  toggleMode: () => void;
  toggleNickname: () => void;
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
  id: number;
  location: string;
  nickname?: string;
  pokemon: TPokemon;
  status: TStatus;
};

export type TPokemon = {
  key?: string;
  image: string;
  text: string;
  value: number;
};

export type TStatus = {
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
