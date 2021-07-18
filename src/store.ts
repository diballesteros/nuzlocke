import create, { State, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';
import { AppState, TGame, TPokemon, TStatus } from 'constants/types';
import { GAMES, INITIAL_STATE } from 'constants/constant';

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
      duplicates: false,
      darkMode: false,
      selectedGame: null,
      gamesList: GAMES,
      games: INITIAL_STATE.games,
      text: '',
      importState: (newAppState: Partial<AppState>) =>
        set((state) => {
          state.games = newAppState.games;
          state.selectedGame = newAppState.selectedGame;
          state.gamesList = newAppState.gamesList;
        }),
      changeDupe: () =>
        set((state) => {
          state.duplicates = !state.duplicates;
        }),
      changePokemon: (encounterId: number, pokemon: TPokemon) =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters[encounterId].pokemon = pokemon;
        }),
      changeStatus: (encounterId: number, status: TStatus) =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters[encounterId].status = status;
        }),
      resetAll: () =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters =
            INITIAL_STATE.games[state.selectedGame?.value]?.encounters;
        }),
      selectGame: (game: TGame) =>
        set((state) => {
          state.selectedGame = game;
        }),
      selectBadge: (badgeIndex: number) =>
        set((state) => {
          if (state.games[state.selectedGame?.value]?.badge === badgeIndex) {
            state.games[state.selectedGame?.value].badge -= 1;
          } else {
            state.games[state.selectedGame?.value].badge = badgeIndex;
          }
        }),
      search: (text: string) =>
        set((state) => {
          state.text = text;
        }),
      addEncounter: (newLocation: string) =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters.push({
            id: state.games[state.selectedGame?.value].encounters.length,
            location: newLocation,
            pokemon: null,
            status: null,
          });
        }),
      clearEncounter: (encounterId: number) => {
        set((state) => {
          state.games[state.selectedGame?.value].encounters[encounterId].status = null;
          state.games[state.selectedGame?.value].encounters[encounterId].pokemon = null;
        });
      },
      deleteEncounter: (encounterId: number) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1) state.games[state.selectedGame?.value].encounters.splice(index, 1);
        }),
      addGame: (newGame: string) =>
        set((state) => {
          const newIndex = Object.keys(state.games).length + 1;
          state.games[newIndex.toString()] = { badge: null, encounters: [] };
          state.gamesList.push({ value: newIndex.toString(), text: newGame, key: 'newGame' });
        }),
      toggleMode: () => {
        set((state) => {
          state.darkMode = !state.darkMode;
        });
      },
    })),
    {
      name: 'pokemon-tracker',
    }
  )
);

export default useStore;
