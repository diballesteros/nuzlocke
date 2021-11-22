import _ from 'lodash';
import { getTypeCountParams, getTypeParams } from 'constants/constant';
import EFFECTIVENESS from 'constants/effectiveness';
import { MOVEMAP } from 'constants/moves';
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
  const typeParams = getTypeParams(state?.selectedGame?.value);

  let i = 0;
  while (typeParams[0].length > 0 && team.length > i) {
    const foundPokemon = POKEMAP.get(team[i]?.pokemon);
    if (foundPokemon?.type && EFFECTIVENESS[typeParams[1]][foundPokemon.type]) {
      typeParams[0] = _.difference(
        typeParams[0],
        EFFECTIVENESS[typeParams[1]][foundPokemon.type]['Super effective against']
      );
    }
    if (foundPokemon?.dualtype && EFFECTIVENESS[typeParams[1]][foundPokemon.dualtype]) {
      typeParams[0] = _.difference(
        typeParams[0],
        EFFECTIVENESS[typeParams[1]][foundPokemon.dualtype]['Super effective against']
      );
    }
    i += 1;
  }

  const neededTypes = Object.keys(EFFECTIVENESS[typeParams[1]]).filter((type) => {
    return EFFECTIVENESS[typeParams[1]][type as Type]?.['Super effective against']?.some(
      (saType) => {
        return typeParams[0].includes(saType);
      }
    );
  });

  return neededTypes as Type[];
};

export const selectBuilderStrong = (state: AppState): { [key in Type]: number } => {
  const team = state?.team[state?.selectedGame?.value];
  if (!team?.length) return undefined;
  const typeParams = getTypeCountParams(state?.selectedGame?.value);

  let i = 0;
  while (team.length > i) {
    team[i]?.moves?.forEach((move) => {
      const foundMove = MOVEMAP.get(move);
      if (
        foundMove?.type &&
        (foundMove?.category === 'Physical' || foundMove?.category === 'Special') &&
        EFFECTIVENESS[typeParams[1]][foundMove.type]
      ) {
        EFFECTIVENESS[typeParams[1]][foundMove.type]['Super effective against'].forEach((type) => {
          typeParams[0][type] += 1;
        });
      }
    });
    i += 1;
  }

  return typeParams[0];
};

export const selectBuilderWeak = (state: AppState): { [key in Type]: number } => {
  const team = state?.team[state?.selectedGame?.value];
  if (!team?.length) return undefined;

  const typeParams = getTypeCountParams(state?.selectedGame?.value);

  let i = 0;
  while (team.length > i) {
    const foundPokemon = POKEMAP.get(team[i]?.id);
    if (foundPokemon?.type && EFFECTIVENESS[typeParams[1]][foundPokemon.type]) {
      EFFECTIVENESS[typeParams[1]][foundPokemon.type]['Weak against'].forEach((type) => {
        typeParams[0][type] += 1;
        if (
          foundPokemon?.dualtype &&
          (EFFECTIVENESS[typeParams[1]][foundPokemon.dualtype].Resists.includes(type) ||
            EFFECTIVENESS[typeParams[1]][foundPokemon.dualtype]['Immune to'].includes(type))
        ) {
          typeParams[0][type] -= 1;
        }
      });
    }
    if (foundPokemon?.dualtype && EFFECTIVENESS[typeParams[1]][foundPokemon.dualtype]) {
      EFFECTIVENESS[typeParams[1]][foundPokemon.dualtype]['Weak against'].forEach((type) => {
        typeParams[0][type] += 1;
        if (
          EFFECTIVENESS[typeParams[1]][foundPokemon.type].Resists.includes(type) ||
          EFFECTIVENESS[typeParams[1]][foundPokemon.type]['Immune to'].includes(type)
        ) {
          typeParams[0][type] -= 1;
        }
      });
    }
    i += 1;
  }
  return typeParams[0];
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
