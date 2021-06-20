export type AppState = {
  selectedGame: TGame;
  games: Games;
};

export type Games = { [key: string]: TrackData };

export type TrackData = {
  badge: number;
  encounters: TEncounter[];
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
    }
  | {
      type: 'CHANGE_STATUS';
      payload: {
        encounterId: number;
        status: TStatus;
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

export type TEncounter = {
  encounter: TPokemon | string;
  id: number;
  location: string;
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
