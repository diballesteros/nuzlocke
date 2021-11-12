import _ from 'lodash';
import { GAME_GENERATION, TYPES } from 'constants/constant';
import EFFECTIVENESS from 'constants/effectiveness';
import { POKEMAP } from 'constants/pokemon';

import { AppState, TEncounter, Type } from 'constants/types';

export const selectTeam = (state: AppState): TEncounter[] => {
  return state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return enc?.status?.value === 7;
  });
};

export const selectSuggestion = (state: AppState): Type[] => {
  const team = state?.games[state?.selectedGame?.value]?.encounters?.filter((enc) => {
    return enc?.status?.value === 7;
  });
  if (team?.length === 0) return undefined;
  let types = [...TYPES];
  let genRange = 'Gen 6 - 8';

  if (GAME_GENERATION[state?.selectedGame?.value] === 1) {
    genRange = 'Gen 1';
    types = types.filter((gen1) => gen1 !== 'DARK' && gen1 !== 'FAIRY' && gen1 !== 'STEEL');
  } else if (
    GAME_GENERATION[state?.selectedGame?.value] >= 2 &&
    GAME_GENERATION[state?.selectedGame?.value] <= 5
  ) {
    genRange = 'Gen 2 - 5';
    types = types.filter((gen2_5) => gen2_5 !== 'FAIRY');
  }

  let i = 0;
  while (types.length > 0 && team.length > i) {
    const foundPokemon = POKEMAP.get(team[i]?.pokemon);
    if (foundPokemon?.type && EFFECTIVENESS[genRange][foundPokemon.type]) {
      types = _.difference(
        types,
        EFFECTIVENESS[genRange][foundPokemon.type]['Super effective against']
      );
    }
    if (foundPokemon?.dualtype && EFFECTIVENESS[genRange][foundPokemon.dualtype]) {
      types = _.difference(
        types,
        EFFECTIVENESS[genRange][foundPokemon.dualtype]['Super effective against']
      );
    }
    i += 1;
  }

  const neededTypes = Object.keys(EFFECTIVENESS[genRange]).filter((type) => {
    return EFFECTIVENESS[genRange][type as Type]?.['Super effective against']?.some((saType) => {
      return types.includes(saType);
    });
  });

  return neededTypes as Type[];
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
    ? encountered.length / state.games[state.selectedGame.value].encounters.length
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
