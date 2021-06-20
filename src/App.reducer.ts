import { AppActions, AppState } from 'constants/types';

const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case 'SELECT_GAME':
      state.selectedGame = action.payload.game;
      return;
    case 'SELECT_BADGE':
      if (state.games[state.selectedGame?.id].badge === action.payload.badgeIndex) {
        state.games[state.selectedGame?.id].badge -= 1;
      } else {
        state.games[state.selectedGame?.id].badge = action.payload.badgeIndex;
      }
      return;
    case 'CHANGE_STATUS':
      state.games[state.selectedGame?.id].encounters[action.payload.encounterId].status =
        action.payload.status;
      break;
    default:
      return { ...state };
  }
};

export default appReducer;
