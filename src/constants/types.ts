export interface TrackerState {
  games: Games;
  gamesList: TGame[];
  selectedGame: TGame;
  text: string;
  darkMode: boolean;
}

export interface AppState extends TrackerState {
  addEncounter: (newLocation: string) => void;
  addGame: (newGame: string) => void;
  changePokemon: (encounterId: number, pokemon: TPokemon) => void;
  changeStatus: (encounterId: number, status: TStatus) => void;
  clearEncounter: (encounterId: number) => void;
  importState: (newAppState: Partial<AppState>) => void;
  resetAll: () => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
  toggleMode: () => void;
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
  levelCap: number;
  name: string;
  src: string;
};

export type TEncounter = {
  id: number;
  location: string;
  pokemon: TPokemon;
  status: TStatus;
};

export type TPokemon = {
  id: number;
  name: string;
  src: string;
};

export type TStatus = {
  key: string;
  text: string;
  value: number;
};

export type TLocation = {
  name: string;
};
