export interface TrackerState {
  badges: TBadgeDictionary;
  darkMode: boolean;
  duplicates: boolean;
  games: Games;
  gamesList: TGame[];
  newVersion: string;
  nicknames: boolean;
  rules: TRule[];
  selectedGame: TGame;
  text: string;
}

export interface AppState extends TrackerState {
  addEncounter: (newLocation: string) => void;
  addGame: (newGame: string) => void;
  addRule: (newRule: string) => void;
  changeDupe: () => void;
  changePokemon: (encounterId: number, pokemon: TPokemon) => void;
  changeNickname: (encounterId: number, nickname: string) => void;
  changeStatus: (encounterId: number, status: TStatus) => void;
  clearEncounter: (encounterId: number) => void;
  deleteGame: () => void;
  deleteEncounter: (encounterId: number) => void;
  editBadge: (newBadge: string, i: number) => void;
  importState: (newAppState: Partial<AppState>) => void;
  removeNew: () => void;
  reorderRule: (destinationId: number, rule: TRule, sourceId: number) => void;
  resetAll: () => void;
  resetBadges: () => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
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

export type TRule = {
  content: string;
};
