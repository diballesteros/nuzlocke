import { AppActions, AppState } from 'constants/types';

const appReducer = (state: AppState, actions: AppActions): AppState => {
  switch (actions.type) {
    case 'SELECT_GAME':
    default:
      return { ...state };
  }
};

export default appReducer;
