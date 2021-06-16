export type AppState = {
  selectedGame: TGame;
  games: Games;
};

export type Games = { [key: string]: TrackData };

export type TrackData = {
  badge: number;
};

export type AppActions = {
  type: 'SELECT_GAME';
  payload: {
    game: string;
  };
};

export type TGame = {
  id: number;
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
export type TPokemon = {
  id: number;
  name: string;
  src: string;
};

export type TStatus = {
  id: number;
  name: string;
};
