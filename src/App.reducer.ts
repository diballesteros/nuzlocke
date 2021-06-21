import { INITIAL_STATE } from 'constants/constant';
import { AppActions, AppState } from 'constants/types';

const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case 'RESET_ALL':
      state.games[state.selectedGame?.id] = INITIAL_STATE.games[state.selectedGame?.id];
      break;
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
    case 'CHANGE_POKEMON':
      state.games[state.selectedGame?.id].encounters[action.payload.encounterId].pokemon =
        action.payload.pokemon;
      break;
    default:
      return { ...state };
  }
};

export default appReducer;
