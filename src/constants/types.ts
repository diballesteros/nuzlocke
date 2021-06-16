export type AppState = {
  selectedGame: TGame;
  games: Games;
};

export type Games = { [key: string]: TrackData };

export type TrackData = {
  badge: number;
};

export type AppActions =
  | {
      type: 'SELECT_GAME';
      payload: {
        game: TGame;
      };
    }
  | {
      type: 'SELECT_BADGE';
      payload: {
        badgeIndex: number;
      };
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
export type TPokemon = {
  id: number;
  name: string;
  src: string;
};

export type TStatus = {
  id: number;
  name: string;
};
