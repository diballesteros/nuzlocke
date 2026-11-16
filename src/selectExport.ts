import type { AppState } from 'constants/types';

// The saved run as the Export button downloads it
const selectExport = (state: AppState): string => {
  const {
    badges,
    customBadges,
    customStatuses,
    darkMode,
    duplicates,
    games,
    gamesList,
    missing,
    nicknames,
    rules,
    selectedGame,
    showAll,
    suggestions,
    team,
    notes,
  } = state;

  return JSON.stringify({
    badges,
    customBadges,
    customStatuses,
    darkMode,
    duplicates,
    games,
    gamesList,
    missing,
    nicknames,
    rules,
    selectedGame,
    showAll,
    suggestions,
    team,
    notes,
  });
};

export default selectExport;
