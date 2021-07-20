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
      newVersion: true,
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
      removeNew: () =>
        set((state) => {
          state.newVersion = false;
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
          const newKey = Number(state.gamesList[state.gamesList.length - 1].value) + 1;
          state.games[newKey.toString()] = { badge: null, encounters: [] };
          state.gamesList.push({
            value: newKey.toString(),
            text: newGame,
            key: `custom-game-${newGame}-${new Date()}`,
          });
        }),
      deleteGame: () =>
        set((state) => {
          delete state.games[state?.selectedGame.value];
          const gameIndex = state.gamesList.findIndex(
            (game) => game.value === state?.selectedGame.value
          );
          state.gamesList.splice(gameIndex, 1);
          state.selectedGame = null;
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
