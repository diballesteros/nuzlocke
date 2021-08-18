import create, { State, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';
import { AppState, TGame, TPokemon, TRule, TStatus } from 'constants/types';
import { GAMES, INITIAL_STATE } from 'constants/constant';
import BADGES, { GAME_CAP_DICTIONARY } from 'constants/badges';

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
      badges: BADGES,
      darkMode: false,
      duplicates: false,
      games: INITIAL_STATE.games,
      gamesList: GAMES,
      missing: false,
      newVersion: '1',
      nicknames: false,
      rules: INITIAL_STATE.rules,
      rulesets: INITIAL_STATE.rulesets,
      selectedGame: null,
      selectedRuleset: '1',
      showAll: false,
      text: '',
      addEncounter: (newLocation: string) =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters.push({
            id: state.games[state.selectedGame?.value].encounters.length,
            location: newLocation,
            pokemon: null,
            status: null,
          });
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
      addRule: (newRule: string) =>
        set((state) => {
          state.rules[state.selectedRuleset]?.push({ content: newRule });
        }),
      addRuleset: (rulesetName: string) =>
        set((state) => {
          const newKey = Number(state.rulesets[state.rulesets.length - 1].value) + 1;
          state.rules[newKey.toString()] = [];
          state.rulesets.push({
            value: newKey.toString(),
            text: rulesetName,
            key: `custom-ruleset-${rulesetName}-${new Date()}`,
          });
        }),
      changeDetails: (
        encounterId: number,
        level: number,
        metLevel: number,
        gender: string,
        ability: string,
        nature: string,
        item: string,
        faint: string,
        moveOne: number,
        moveTwo: number,
        moveThree: number,
        moveFour: number
      ) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].details = {
              level,
              metLevel,
              gender,
              ability,
              id: state.games[state.selectedGame?.value].encounters[index].pokemon,
              nature,
              item,
              faint,
              moves: [moveOne, moveTwo, moveThree, moveFour],
            };
        }),
      changeDupe: () =>
        set((state) => {
          state.duplicates = !state.duplicates;
        }),
      changeNickname: (encounterId: number, nickname: string) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].nickname = nickname;
        }),
      changePokemon: (encounterId: number, pokemonId: number) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].pokemon = pokemonId;
        }),
      changeRuleset: (rulesetId: string) =>
        set((state) => {
          state.selectedRuleset = rulesetId;
        }),
      changeStatus: (encounterId: number, status: TStatus) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].status = status;
        }),
      clearEncounter: (encounterId: number) => {
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1) state.games[state.selectedGame?.value].encounters[index].status = null;
          if (index !== -1) state.games[state.selectedGame?.value].encounters[index].pokemon = null;
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].nickname = null;
        });
      },
      deleteEncounter: (encounterId: number) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1) state.games[state.selectedGame?.value].encounters.splice(index, 1);
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
      deleteRule: (ruleIndex: number) =>
        set((state) => {
          state.rules[state.selectedRuleset].splice(ruleIndex, 1);
        }),
      deleteRuleset: () =>
        set((state) => {
          delete state.rules[state.selectedRuleset];
          const rulesetIndex = state.rulesets.findIndex(
            (game) => game.value === state?.selectedRuleset
          );
          state.rulesets.splice(rulesetIndex, 1);
          state.selectedRuleset = '1';
        }),
      editBadge: (newBadge: string, i: number) =>
        set((state) => {
          state.badges[state.selectedGame?.value][i].levelCap = newBadge;
        }),
      editRule: (newRule: string, i: number) =>
        set((state) => {
          state.rules[state.selectedRuleset][i].content = newRule;
        }),
      importState: (newAppState: Partial<AppState>) =>
        set((state) => {
          state.games = newAppState.games;
          state.selectedGame = newAppState.selectedGame;
          state.gamesList = newAppState.gamesList;
          if (newAppState.badges) state.badges = newAppState.badges;
          if (newAppState.rules) state.rules = newAppState.rules;
          if (newAppState.rulesets) state.rulesets = newAppState.rulesets;
        }),
      removeNew: () =>
        set((state) => {
          state.newVersion = '3.1.0';
        }),
      reorderRule: (destinationId: number, rule: TRule, sourceId: number) =>
        set((state) => {
          state.rules[state.selectedRuleset]?.splice(sourceId, 1);
          state.rules[state.selectedRuleset]?.splice(destinationId, 0, rule);
        }),
      resetAll: () =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters = !!INITIAL_STATE.games[
            state.selectedGame?.value
          ]?.encounters
            ? INITIAL_STATE.games[state.selectedGame.value].encounters
            : [];
        }),
      resetBadges: (gameKey: string) =>
        set((state) => {
          if (gameKey) {
            state.badges[state.selectedGame?.value].forEach((badge, i) => {
              state.badges[state.selectedGame?.value][i].levelCap = GAME_CAP_DICTIONARY[gameKey][i];
            });
          } else {
            state.badges[state.selectedGame?.value] = BADGES[state.selectedGame?.value];
          }
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
      toggleMissing: () => {
        set((state) => {
          state.missing = !state.missing;
        });
      },
      toggleMode: () => {
        set((state) => {
          state.darkMode = !state.darkMode;
        });
      },
      toggleNickname: () => {
        set((state) => {
          state.nicknames = !state.nicknames;
        });
      },
      toggleShowAll: () => {
        set((state) => {
          state.showAll = !state.showAll;
        });
      },
    })),
    {
      name: 'pokemon-tracker',
      version: 1,
      migrate: (persistedState: AppState) => {
        const gameMigration = persistedState.games;
        Object.keys(gameMigration).map((key) => {
          gameMigration[key].encounters.forEach((enc) => {
            enc.pokemon = (enc.pokemon as unknown as TPokemon)?.value || null;
          });
        });
        return { ...persistedState, games: gameMigration };
      },
    }
  )
);

export default useStore;
