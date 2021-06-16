import { INITIAL_STATE } from 'constants/constant';
import { AppActions, AppState } from 'constants/types';
import React from 'react';

const AppContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppActions>;
}>({ state: INITIAL_STATE, dispatch: () => undefined });

export default AppContext;
