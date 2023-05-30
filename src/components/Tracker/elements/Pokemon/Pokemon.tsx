import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import shallow from 'zustand/shallow';
import { PkmImage, PokemonSelector } from 'common';
import { getGenderIcon } from 'components/PokeInfo/PokeInfo';
import FILTERS from 'constants/filters';
import POKEMON, { POKEMAP } from 'constants/pokemon';
import type { TEncounter, TPokemon } from 'constants/types';
import { selectSuggestion, selectTotal } from 'selectors';
import useStore from 'store';
import styles from './Pokemon.module.scss';

interface PokemonProps {
  encounter: TEncounter;
  foundPokemon: TPokemon;
}

const Pokemon = React.memo(function Pokemon({ encounter, foundPokemon }: PokemonProps) {
  const { t } = useTranslation('tracker');
  const changePokemon = useStore((state) => state.changePokemon);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const duplicates = useStore(useCallback((state) => state.duplicates, []));
  const total = useStore(selectTotal);
  const showAll = useStore(useCallback((state) => state.showAll, []));
  const suggestionsSettings = useStore(useCallback((state) => state.suggestions, []));
  const games = useStore(useCallback((state) => state.games, []));
  const showAllTooltip = useStore(useCallback((state) => state.showAllTooltip, []));
  const suggestions = useStore(selectSuggestion);
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const rules = useStore(useCallback((state) => state.rules, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));

  const RULE_ALERTS: { [key: string]: string } = {
    'DUPE': t('alert_dupe'),
    'FORBIDDEN GEN': t('alert_gen'),
    'OVERLEVELED': t('alert_overleveled'),
    'FORBIDDEN TYPE': t('alert_type'),
    'TEAM OVER 6': t('alert_max'),
  };

  const getAlertText = useCallback(
    (pokemonId: number) => {
      let alert = '';
      let teamCounter = 0;
      const genRule = rules[selectedRuleset]?.find((rule) => rule.type === 'GENERATION');
      const levelRule = rules[selectedRuleset]?.find((rule) => rule.type === 'LEVEL');
      const typeRule = rules[selectedRuleset]?.find((rule) => rule.type === 'TYPE');
      const foundPoke = POKEMAP.get(pokemonId);
      if (!foundPoke) {
        return '';
      }
      games[selectedGame?.value].encounters?.forEach((enc) => {
        if (
          duplicates &&
          !!pokemonId &&
          enc?.pokemon === pokemonId &&
          enc.id !== encounter?.id &&
          enc?.status?.value !== 5 &&
          encounter?.status?.value !== 5
        ) {
          alert = 'DUPE';
        }
        if (encounter?.status?.value === 7 && enc?.status?.value === 7) {
          teamCounter += 1;
        }
        if (
          (genRule?.content as number[])?.length > 0 &&
          !(genRule?.content as number[])?.includes(foundPoke?.generation)
        ) {
          alert = 'FORBIDDEN GEN';
        }
        if ((levelRule?.content as number) < encounter?.details?.level) {
          alert = 'OVERLEVELED';
        }
        if (
          (typeRule?.content as string[])?.length > 0 &&
          !(typeRule?.content as string[])?.includes(foundPoke?.type) &&
          !(typeRule?.content as string[])?.includes(foundPoke?.dualtype)
        ) {
          alert = 'FORBIDDEN TYPE';
        }
      });
      if (teamCounter > 6) {
        return 'TEAM OVER 6';
      }
      return alert;
    },
    [duplicates, encounter, games, rules, selectedGame, selectedRuleset]
  );

  const alertText = useMemo(() => {
    return getAlertText(encounter?.pokemon);
  }, [encounter?.pokemon, getAlertText]);

  const filter = useMemo(() => {
    return encounter?.filterKey && !showAll
      ? POKEMON.reduce((filtered, poke) => {
          if (
            FILTERS[encounter?.filterKey]?.includes(poke.text) ||
            encounter.pokemon === poke.value
          ) {
            filtered.push(poke.value);
          }
          return filtered;
        }, [])
      : false;
  }, [encounter, showAll]);

  const onChange = (pokemonId: number) => {
    changePokemon(encounter.id, pokemonId);
    const alert = getAlertText(pokemonId);
    if (!!alert && !toast.isActive(alert)) {
      toast.warn(RULE_ALERTS[alert], { toastId: alert });
    }
  };

  return (
    <div className={styles.pokemonSelect}>
      <div aria-label="Pokémon selector" className={styles.container}>
        <PokemonSelector
          dupes={total?.map((c) => c.pokemon)}
          filter={filter}
          handlePokemon={onChange}
          suggestions={
            filter && suggestions && suggestionsSettings && !showAll ? suggestions : false
          }
          tooltip={showAllTooltip}
        >
          {encounter?.pokemon ? (
            <div className={styles.selector} data-testid={`pokemon-${encounter.id}`}>
              <div className={styles.image}>
                <PkmImage name={foundPokemon.text} shiny={encounter?.details?.shiny} />
              </div>
              <span className={styles.name}>
                {foundPokemon.text}
                {getGenderIcon(encounter?.details?.gender)}
              </span>
              <span className={styles.level}>Lv: {encounter?.details?.level ?? 0}</span>
            </div>
          ) : (
            <div className={styles.selector} data-testid={`pokemon-${encounter.id}`}>
              <span data-testid={`encounter-empty-${encounter.id}`} className={styles.placeholder}>
                Pokémon...
              </span>
            </div>
          )}
        </PokemonSelector>
      </div>
      {!!alertText && (
        <Popup
          content={<b>{alertText}</b>}
          inverted={darkMode}
          trigger={
            <Icon
              className={styles.alert}
              data-testid={`alert-${encounter.id}`}
              name="warning sign"
            />
          }
        />
      )}
    </div>
  );
});

export default Pokemon;
