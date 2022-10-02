import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import BADGES, { GAME_CAP_DICTIONARY, LEVEL_CAPS } from 'constants/badges';
import { DEFAULT_VALUES } from 'constants/calculator';
import {
  DEFAULT_RULES,
  DEFAULT_RULESET_NAMES,
  GAME_KEY_DICTIONARY,
  GAMES,
  INITIAL_STATE,
  INITIAL_SUMMARY,
  SOULLINK_RULESET,
  WEDLOCKE_RULESSET,
} from 'constants/constant';
import STATUSES from 'constants/status';
import type {
  AppState,
  Gender,
  PokemonDetail,
  TCalculatorForm,
  TEncounter,
  TGame,
  TLanguage,
  TPokemon,
  TRuleContent,
  TRuleEntry,
  TRulesetDictionary,
  TStatus,
  TSummaryBasic,
  Type,
} from 'constants/types';

function assertAppState(val: unknown): asserts val is AppState {
  if (typeof val !== 'object') {
    throw new TypeError('Invalid app state');
  }
}

const useStore = create<AppState>()(
  persist(
    immer((set) => ({
      badges: BADGES,
      calcs: INITIAL_STATE.calcs,
      customBadges: {},
      customStatuses: [],
      darkMode: INITIAL_STATE.darkMode,
      duplicates: INITIAL_STATE.duplicates,
      games: INITIAL_STATE.games,
      gamesList: GAMES,
      gens: [],
      language: 'en',
      missing: INITIAL_STATE.missing,
      newVersion: INITIAL_STATE.newVersion,
      nicknames: INITIAL_STATE.nicknames,
      notes: INITIAL_STATE.notes,
      rules: INITIAL_STATE.rules,
      rulesets: null, // No longer used
      selectedGame: INITIAL_STATE.selectedGame,
      selectedRuleset: INITIAL_STATE.selectedRuleset,
      showAll: INITIAL_STATE.showAll,
      showAllTooltip: INITIAL_STATE.showAllTooltip,
      soulink: INITIAL_STATE.soulink,
      suggestions: INITIAL_STATE.suggestions,
      summary: INITIAL_STATE.summary,
      team: INITIAL_STATE.team,
      text: '',
      types: [],
      typeModal: null,
      addCustomBadge: () =>
        set((state) => {
          if (state.customBadges[state.selectedGame?.value]) {
            state.customBadges[state.selectedGame?.value].push(0);
          } else {
            state.customBadges[state.selectedGame?.value] = [0];
          }
        }),
      addCustomStatus: (status: string) =>
        set((state) => {
          state.customStatuses.push({
            icon: null,
            key: status,
            value: new Date().getTime(),
            text: status,
          });
        }),
      addEncounter: (newLocation: string) =>
        set((state) => {
          state.games[state.selectedGame?.value].encounters.push({
            id: new Date().getTime(),
            location: newLocation,
            pokemon: null,
            status: null,
          });
        }),
      addGame: (newGame: string, templateKey?: string) =>
        set((state) => {
          const newKey = Number(state.gamesList[state.gamesList.length - 1].value) + 1;
          state.games[newKey.toString()] = {
            badge: [],
            encounters: templateKey ? [...INITIAL_STATE.games[templateKey].encounters] : [],
          };
          state.summary[newKey.toString()] = { ...INITIAL_SUMMARY };
          state.calcs[newKey.toString()] = {
            form: { ...DEFAULT_VALUES, calculatorGen: 8, pokemon1: 1, pokemon2: 1 },
          };
          const newGameObj = {
            value: newKey.toString(),
            text: newGame,
            key: `custom-game-${newGame}-${new Date()}`,
          };
          if (templateKey) {
            const gameCapKey = LEVEL_CAPS[templateKey][0].value;
            state.customBadges[newKey.toString()] = [...GAME_CAP_DICTIONARY[gameCapKey]];
          }
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
        moveFour: number,
        shiny: boolean,
        ivhp: number,
        ivatk: number,
        ivdef: number,
        ivspatk: number,
        ivspdef: number,
        ivspeed: number,
        evhp: number,
        evatk: number,
        evdef: number,
        evspatk: number,
        evspdef: number,
        evspeed: number,
        soulink
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
              shiny,
              ivhp,
              ivatk,
              ivdef,
              ivspatk,
              ivspdef,
              ivspeed,
              evhp,
              evatk,
              evdef,
              evspatk,
              evspdef,
              evspeed,
              soulink,
            };
        }),
      changeDupe: () =>
        set((state) => {
          state.duplicates = !state.duplicates;
        }),
      changeLevel: (encounterId: number, increase: boolean) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1) {
            const hasDetails = state.games[state.selectedGame?.value].encounters[index].details;
            const level = state.games[state.selectedGame?.value].encounters[index].details?.level;
            if (!hasDetails) {
              state.games[state.selectedGame?.value].encounters[index].details = {
                id: state.games[state.selectedGame?.value].encounters[index].pokemon,
                level: 1,
                moves: [],
              };
            } else if (!level) {
              state.games[state.selectedGame?.value].encounters[index].details.level = 1;
            } else if (increase) {
              state.games[state.selectedGame?.value].encounters[index].details.level = level + 1;
            } else {
              state.games[state.selectedGame?.value].encounters[index].details.level = level - 1;
            }
          }
        }),
      changeNature: (encounterId: number, nature: string) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });

          if (index !== -1)
            if (state.games[state.selectedGame?.value].encounters[index].details) {
              state.games[state.selectedGame?.value].encounters[index].details.nature = nature;
            } else {
              state.games[state.selectedGame?.value].encounters[index].details = {
                id: state.games[state.selectedGame?.value].encounters[index].pokemon,
                level: 1,
                moves: [],
                nature,
              };
            }
        }),
      changeNickname: (encounterId: number, nickname: string) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].nickname = nickname;
        }),
      changeNotes: (text: string) =>
        set((state) => {
          state.notes[state.selectedGame?.value] = text;
        }),
      changePokemon: (encounterId: number, pokemonId: number) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].pokemon = pokemonId;
        }),
      changePreviousStatus: (encounterId: number, status: TStatus) =>
        set((state) => {
          const index = state.games[state.selectedGame?.value].encounters.findIndex((enc) => {
            return enc.id === encounterId;
          });
          if (index !== -1)
            state.games[state.selectedGame?.value].encounters[index].previousStatus = status;
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
      deleteCustomBadge: (index: number) =>
        set((state) => {
          state.customBadges[state.selectedGame?.value].splice(index, 1);
        }),
      deleteCustomStatus: (index: number) =>
        set((state) => {
          const customStatusValue = state.customStatuses[index];
          Object.keys(state.games).forEach((key) => {
            state.games[key].encounters.forEach((enc) => {
              if (customStatusValue.value === enc.status?.value) {
                enc.status = null;
              }
            });
          });
          state.customStatuses.splice(index, 1);
        }),
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
          if (state.customBadges[state?.selectedGame?.value]) {
            delete state.customBadges[state?.selectedGame?.value];
          }
          if (state.notes[state?.selectedGame?.value]) {
            delete state.notes[state?.selectedGame?.value];
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
      editCustomBadge: (newBadge: string, i: number) =>
        set((state) => {
          state.customBadges[state.selectedGame?.value][i] = newBadge;
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
      exportToGame: (encounter: TEncounter, game: string, location: string) =>
        set((state) => {
          state.games[game].encounters.unshift({
            ...encounter,
            id: new Date().getTime(),
            location,
          });
        }),
      importState: (newAppState: Partial<AppState>) =>
        set((state) => {
          state.games = newAppState.games;
          state.selectedGame = newAppState.selectedGame;
          state.gamesList = newAppState.gamesList;
          state.darkMode = !!newAppState.darkMode;
          state.duplicates = !!newAppState.duplicates;
          state.missing = !!newAppState.missing;
          state.nicknames = !!newAppState.nicknames;
          state.showAll = !!newAppState.showAll;
          state.suggestions = !!newAppState.suggestions;
          if (newAppState.badges) state.badges = newAppState.badges;
          if (newAppState.rules) state.rules = newAppState.rules;
          if (newAppState.team) state.team = newAppState.team;
          if (newAppState.customBadges) state.customBadges = newAppState.customBadges;
          if (newAppState.customStatuses) state.customStatuses = newAppState.customStatuses;
          if (newAppState.notes) state.notes = newAppState.notes;
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
          state.games[state.selectedGame?.value].badge = [];
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
          if (!Array.isArray(state.games[state.selectedGame?.value]?.badge)) {
            state.games[state.selectedGame?.value].badge = [];
          }
          if (state.games[state.selectedGame?.value]?.badge?.includes(badgeIndex)) {
            state.games[state.selectedGame.value].badge = state.games[
              state.selectedGame.value
            ].badge?.filter((badge) => badge !== badgeIndex);
          } else {
            state.games[state.selectedGame?.value].badge.push(badgeIndex);
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
      setLanguage: (language: TLanguage) =>
        set((state) => {
          state.language = language;
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
      toggleShowAllTooltip: () => {
        set((state) => {
          state.showAllTooltip = false;
        });
      },
      toggleSoulink: () => {
        set((state) => {
          state.soulink = !state.soulink;
        });
      },
      toggleSuggestions: () => {
        set((state) => {
          state.suggestions = !state.suggestions;
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
      version: 8,
      migrate: (persistedState, version) => {
        assertAppState(persistedState);
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

        if (version < 4) {
          gameMigration['13.1'] = INITIAL_STATE.games['13.1'];
          persistedState.calcs['13.1'] = INITIAL_STATE.calcs['13.1'];
          persistedState.summary['13.1'] = INITIAL_STATE.summary['13.1'];
          persistedState.badges['13.1'] = INITIAL_STATE.badges['13.1'];
          persistedState.gamesList.splice(13, 0, INITIAL_STATE.gamesList[13]);
        }

        if (version < 5) {
          if (!gameMigration['13.1']) {
            gameMigration['13.1'] = INITIAL_STATE.games['13.1'];
            persistedState.calcs['13.1'] = INITIAL_STATE.calcs['13.1'];
            persistedState.summary['13.1'] = INITIAL_STATE.summary['13.1'];
            persistedState.badges['13.1'] = INITIAL_STATE.badges['13.1'];
            persistedState.gamesList.splice(13, 0, INITIAL_STATE.gamesList[13]);
          }
        }

        if (version < 6) {
          persistedState.badges = INITIAL_STATE.badges;
          Object.keys(GAME_KEY_DICTIONARY).forEach((key) => {
            gameMigration[key].encounters.forEach((enc) => {
              if (enc?.status?.value === 6) {
                enc.status = STATUSES[1];
                if (enc?.details) {
                  enc.details.shiny = true;
                }
              }
            });
          });

          if (!persistedState.rules.Soulocke) {
            persistedState.rules.Soulocke = SOULLINK_RULESET;
          }
        }

        if (version < 7) {
          Object.keys(gameMigration).forEach((key) => {
            if (gameMigration[key].badge) {
              gameMigration[key].badge = Array(gameMigration[key].badge)
                .fill(null)
                .map((_, i) => i);
            } else {
              gameMigration[key].badge = [];
            }
          });

          if (!persistedState.rules.Wedlocke) {
            persistedState.rules.Wedlocke = WEDLOCKE_RULESSET;
          }
        }

        if (version < 8) {
          Object.keys(gameMigration).forEach((key) => {
            gameMigration[key].badge = [];
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
