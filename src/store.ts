import create, { State, StateCreator } from 'zustand';
import { AppState, TGame, TPokemon, TStatus } from 'constants/types';
import produce from 'immer';
import { INITIAL_STATE } from 'constants/constant';

const immer =
  <T extends State>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === 'function' ? produce(partial as (state: T) => T) : (partial as T);
        return set(nextState, replace);
      },
      get,
      api
    );

const useStore = create<AppState>(
  immer((set) => ({
    selectedGame: null,
    games: INITIAL_STATE.games,
    reset: () =>
      set((state) => {
        state.games[state.selectedGame?.id] = INITIAL_STATE.games[state.selectedGame?.id];
      }),
    changePokemon: (encounterId: number, pokemon: TPokemon) =>
      set((state) => {
        state.games[state.selectedGame?.id].encounters[encounterId].pokemon = pokemon;
      }),
    changeStatus: (encounterId: number, status: TStatus) =>
      set((state) => {
        state.games[state.selectedGame?.id].encounters[encounterId].status = status;
      }),
    resetAll: () =>
      set((state) => {
        state.games[state.selectedGame?.id].encounters =
          INITIAL_STATE.games[state.selectedGame?.id]?.encounters;
      }),
    selectGame: (game: TGame) =>
      set((state) => {
        state.selectedGame = game;
      }),
    selectBadge: (badgeIndex: number) =>
      set((state) => {
        if (state.games[state.selectedGame?.id]?.badge === badgeIndex) {
          state.games[state.selectedGame?.id].badge -= 1;
        } else {
          state.games[state.selectedGame?.id].badge = badgeIndex;
        }
      }),
  }))
);

export default useStore;
