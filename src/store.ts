import create, { State, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';
import {
  AppState,
  PokemonDetail,
  TGame,
  TPokemon,
  TRuleContent,
  TRuleEntry,
  TRulesetDictionary,
  TStatus,
  Type,
} from 'constants/types';
import { DEFAULT_RULES, DEFAULT_RULESET_NAMES, GAMES, INITIAL_STATE } from 'constants/constant';
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
      darkMode: INITIAL_STATE.darkMode,
      duplicates: INITIAL_STATE.duplicates,
      games: INITIAL_STATE.games,
      gamesList: GAMES,
      missing: INITIAL_STATE.missing,
      newVersion: INITIAL_STATE.newVersion,
      nicknames: INITIAL_STATE.nicknames,
      rules: INITIAL_STATE.rules,
      rulesets: null, // No longer used
      selectedGame: INITIAL_STATE.selectedGame,
      selectedRuleset: INITIAL_STATE.selectedRuleset,
      showAll: INITIAL_STATE.showAll,
      team: INITIAL_STATE.team,
      text: '',
      typeModal: null,
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
      addRule: (entry: TRuleEntry) =>
        set((state) => {
          state.rules[state.selectedRuleset]?.push(entry);
        }),
      addRuleset: (rulesetName: string) =>
        set((state) => {
          state.rules[rulesetName] = [];
        }),
      addTeamMember: (pokemonId: number) =>
        set((state) => {
          if (state.team[state?.selectedGame?.value]) {
            state.team[state?.selectedGame?.value].push({ id: pokemonId, level: 0, moves: [] });
          } else {
            state.team[state?.selectedGame?.value] = [{ id: pokemonId, level: 0, moves: [] }];
          }
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
      changeTeamMember: (teamIndex: number, detail: PokemonDetail) =>
        set((state) => {
          state.team[state.selectedGame?.value][teamIndex] = { ...detail };
        }),
      clearEncounter: (encounterId: number) => {
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1) {
            state.games[state.selectedGame?.value].encounters[index].status = null;
            state.games[state.selectedGame?.value].encounters[index].pokemon = null;
            state.games[state.selectedGame?.value].encounters[index].nickname = null;
            state.games[state.selectedGame?.value].encounters[index].details = null;
          }
        });
      },
      closeTypeModal: () => {
        set((state) => {
          state.typeModal = null;
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
          if (state.team[state?.selectedGame?.value]) {
            delete state.team[state?.selectedGame?.value];
          }
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
        }),
      deleteTeamMember: (teamIndex: number) =>
        set((state) => {
          state.team[state?.selectedGame?.value].splice(teamIndex, 1);
        }),
      editBadge: (newBadge: string, i: number) =>
        set((state) => {
          state.badges[state.selectedGame?.value][i].levelCap = newBadge;
        }),
      editRule: (newRule: TRuleContent, i: number) =>
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
          if (newAppState.team) state.team = newAppState.team;
        }),
      removeNew: () =>
        set((state) => {
          state.newVersion = process.env.REACT_APP_VERSION;
        }),
      reorderRule: (destinationId: number, rule: TRuleEntry, sourceId: number) =>
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
      showTypeModal: (type: Type) => {
        set((state) => {
          state.typeModal = type;
        });
      },
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
      version: 2,
      migrate: (persistedState: AppState) => {
        const gameMigration = persistedState.games;
        Object.keys(gameMigration).map((key) => {
          gameMigration[key].encounters.forEach((enc) => {
            if (!!(enc?.pokemon as unknown as TPokemon)?.value) {
              enc.pokemon = (enc.pokemon as unknown as TPokemon)?.value || null;
            }
          });
        });
        const newRules: TRulesetDictionary = { ...DEFAULT_RULES };
        persistedState.rulesets.forEach((ruleset) => {
          if (DEFAULT_RULESET_NAMES.includes(ruleset.text)) {
            newRules[`old-${ruleset.text}`] = persistedState.rules[ruleset.value]?.map((rule) => {
              return { content: rule.content, default: false, type: 'TEXT' };
            });
          } else {
            newRules[ruleset.text] = persistedState.rules[ruleset.value]?.map((rule) => {
              return { content: rule.content, default: false, type: 'TEXT' };
            });
          }
        });
        return {
          ...persistedState,
          games: gameMigration,
          rules: newRules,
          selectedRuleset: 'Nuzlocke',
        };
      },
    }
  )
);

export default useStore;
