import produce from 'immer';
import create, { State, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import BADGES, { GAME_CAP_DICTIONARY } from 'constants/badges';
import { DEFAULT_VALUES } from 'constants/calculator';
import {
  DEFAULT_RULES,
  DEFAULT_RULESET_NAMES,
  GAME_KEY_DICTIONARY,
  GAMES,
  INITIAL_STATE,
  INITIAL_SUMMARY,
} from 'constants/constant';
import {
  AppState,
  Gender,
  PokemonDetail,
  TCalculatorForm,
  TEncounter,
  TGame,
  TPokemon,
  TRuleContent,
  TRuleEntry,
  TRulesetDictionary,
  TStatus,
  TSummaryBasic,
  Type,
} from 'constants/types';

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
      calcs: INITIAL_STATE.calcs,
      darkMode: INITIAL_STATE.darkMode,
      duplicates: INITIAL_STATE.duplicates,
      games: INITIAL_STATE.games,
      gamesList: GAMES,
      gens: [],
      missing: INITIAL_STATE.missing,
      newVersion: INITIAL_STATE.newVersion,
      nicknames: INITIAL_STATE.nicknames,
      rules: INITIAL_STATE.rules,
      rulesets: null, // No longer used
      selectedGame: INITIAL_STATE.selectedGame,
      selectedRuleset: INITIAL_STATE.selectedRuleset,
      showAll: INITIAL_STATE.showAll,
      summary: INITIAL_STATE.summary,
      team: INITIAL_STATE.team,
      text: '',
      types: [],
      typeModal: null,
      addEncounter: (newLocation: string) =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters.push({
            id: new Date().getTime(),
            location: newLocation,
            pokemon: null,
            status: null,
          });
        }),
      addGame: (newGame: string) =>
        set((state) => {
          const newKey = Number(state.gamesList[state.gamesList.length - 1].value) + 1;
          state.games[newKey.toString()] = { badge: null, encounters: [] };
          state.summary[newKey.toString()] = { ...INITIAL_SUMMARY };
          state.calcs[newKey.toString()] = {
            form: { ...DEFAULT_VALUES, calculatorGen: 8, pokemon1: 1, pokemon2: 1 },
          };
          const newGameObj = {
            value: newKey.toString(),
            text: newGame,
            key: `custom-game-${newGame}-${new Date()}`,
          };
          state.gamesList.push(newGameObj);
          state.selectedGame = newGameObj;
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
        gender: Gender,
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
      changeSummaryDescription: (desc: string) =>
        set((state) => {
          state.summary[state.selectedGame?.value].description = desc;
        }),
      changeSummaryStatus: (status: number) =>
        set((state) => {
          state.summary[state.selectedGame?.value].status = status;
        }),
      changeSummaryTitle: (title: string) =>
        set((state) => {
          state.summary[state.selectedGame?.value].title = title;
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
          if (state.summary[state?.selectedGame?.value]) {
            delete state.summary[state?.selectedGame?.value];
          }
          if (state.calcs[state?.selectedGame?.value]) {
            delete state.calcs[state?.selectedGame?.value];
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
      exportTeamMember: (detail: PokemonDetail) =>
        set((state) => {
          if (state.team[state?.selectedGame?.value]) {
            state.team[state?.selectedGame?.value].push(detail);
          } else {
            state.team[state?.selectedGame?.value] = [detail];
          }
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
      massImport: (newEncounters: TEncounter[]) =>
        set((state) => {
          newEncounters.forEach((newEnc) => {
            const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
              return enc.id === newEnc.id;
            });
            state.games[state.selectedGame?.value].encounters[index] = { ...newEnc };
          });
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
          state.games[state.selectedGame?.value].encounters = INITIAL_STATE.games[
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
      setGens: (genId: number) =>
        set((state) => {
          if (state?.gens.includes(genId)) {
            state.gens = state.gens.filter((current) => current !== genId);
          } else {
            state.gens.push(genId);
          }
        }),
      setTypes: (typeId: Type) =>
        set((state) => {
          if (state?.types.includes(typeId)) {
            state.types = state.types.filter((current) => current !== typeId);
          } else {
            state.types.push(typeId);
          }
        }),
      setDefaultCalculator: () => {
        set((state) => {
          state.calcs[state?.selectedGame?.value] = {
            form: { ...DEFAULT_VALUES, calculatorGen: 8, pokemon1: 1, pokemon2: 1 },
          };
        });
      },
      setDefaultSummary: () => {
        set((state) => {
          state.summary[state?.selectedGame?.value] = { ...INITIAL_SUMMARY };
        });
      },
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
      toggleSummarySetting: (property: keyof TSummaryBasic) => {
        set((state) => {
          state.summary[state?.selectedGame?.value][property] =
            !state.summary[state?.selectedGame?.value][property];
        });
      },
      updateDefaultValues: (values: Partial<TCalculatorForm>) => {
        set((state) => {
          state.calcs[state?.selectedGame?.value].form = {
            ...state.calcs[state?.selectedGame?.value].form,
            ...values,
          };
        });
      },
    })),
    {
      name: 'pokemon-tracker',
      version: 3,
      migrate: (persistedState: AppState, version) => {
        const gameMigration = persistedState.games;
        if (version < 1) {
          Object.keys(gameMigration).forEach((key) => {
            gameMigration[key].encounters.forEach((enc) => {
              if ((enc?.pokemon as unknown as TPokemon)?.value) {
                enc.pokemon = (enc.pokemon as unknown as TPokemon)?.value || null;
              }
            });
          });
        }

        const newRules: TRulesetDictionary = { ...DEFAULT_RULES };

        if (persistedState?.rulesets && version < 2) {
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
        }

        if (version < 3) {
          Object.keys(GAME_KEY_DICTIONARY).forEach((key) => {
            gameMigration[key].encounters.forEach((enc) => {
              if (enc?.filter) {
                const newEnc = GAME_KEY_DICTIONARY[key].find(
                  (constEnc) => constEnc.location === enc.location
                );
                if (newEnc) {
                  enc.filterKey = newEnc.filterKey;
                  delete enc.filter;
                }
              }
            });
          });
        }

        return {
          ...persistedState,
          games: gameMigration,
          ...(version < 2 && { rules: newRules }),
          selectedRuleset: 'Nuzlocke',
        };
      },
    }
  )
);

export default useStore;
