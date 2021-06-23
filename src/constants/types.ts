export interface TrackerState {
  games: Games;
  selectedGame: TGame;
  text: string;
}

export interface AppState extends TrackerState {
  changePokemon: (encounterId: number, pokemon: TPokemon) => void;
  changeStatus: (encounterId: number, status: TStatus) => void;
  resetAll: () => void;
  search: (text: string) => void;
  selectGame: (game: TGame) => void;
  selectBadge: (badgeIndex: number) => void;
}

export type Games = { [key: string]: TrackData };

export type TrackData = {
  badge: number;
  encounters: TEncounter[];
};

export type TGame = {
  id: string;
  name: string;
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
  id: number;
  name: string;
};

export type TLocation = {
  name: string;
};
