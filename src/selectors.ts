import { AppState, TEncounter } from 'constants/types';

export const selectTeam = (state: AppState): TEncounter[] => {
  return state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return enc?.status?.value === 7;
  });
};

export const selectBoxed = (state: AppState): TEncounter[] => {
  return state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return (
      enc?.status?.value === 1 ||
      enc?.status?.value === 3 ||
      enc?.status?.value === 4 ||
      enc?.status?.value === 6
    );
  });
};

export const selectFainted = (state: AppState): TEncounter[] => {
  return state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return enc?.status?.value === 2;
  });
};

export const selectCaught = (state: AppState): TEncounter[] => {
  return state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return (
      enc?.status?.value === 1 ||
      enc?.status?.value === 3 ||
      enc?.status?.value === 4 ||
      enc?.status?.value === 6 ||
      enc?.status?.value === 7
    );
  });
};

export const selectCompletion = (state: AppState): number => {
  const encountered = state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return enc.pokemon && enc.status;
  });
  return encountered?.length
    ? encountered?.length / state?.games[state?.selectedGame?.value]?.encounters?.length
    : 0;
};

export const selectFailed = (state: AppState): TEncounter[] => {
  return state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return enc?.status?.value === 5;
  });
};

export const selectShiny = (state: AppState): TEncounter[] => {
  return state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return enc?.status?.value === 6;
  });
};
