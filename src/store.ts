import create, { State, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';
import { AppState, TGame, TPokemon, TStatus } from 'constants/types';
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
  persist(
    immer((set) => ({
      selectedGame: null,
      games: INITIAL_STATE.games,
      text: '',
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
      search: (text: string) =>
        set((state) => {
          state.text = text;
        }),
      addEncounter: (newLocation: string) =>
        set((state) => {
          state.games[state.selectedGame?.id].encounters.push({
            id: state.games[state.selectedGame?.id].encounters.length + 1,
            location: newLocation,
            pokemon: null,
            status: null,
          });
        }),
      clearEncounter: (encounterId: number) => {
        set((state) => {
          state.games[state.selectedGame?.id].encounters[encounterId].status = null;
          state.games[state.selectedGame?.id].encounters[encounterId].pokemon = null;
        });
      },
    })),
    {
      name: 'pokemon-tracker',
    }
  )
);

export default useStore;
