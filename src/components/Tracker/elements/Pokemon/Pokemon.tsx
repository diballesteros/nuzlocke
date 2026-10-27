import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { TriangleAlert } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { PkmImage, PokemonSelector } from 'common';
import { getGenderIcon } from 'components/PokeInfo/PokeInfo';
import FILTERS from 'constants/filters';
import POKEMON, { POKEMAP } from 'constants/pokemon';
import type { TEncounter, TPokemon } from 'constants/types';
import { selectSuggestion, selectTotal } from 'selectors';
import useStore from 'store';
import { HoverPopover } from '@/components/ui/popover';

// The selector's frame. Its SCSS unset box-sizing, so it's content-box (and so is everything inside
// it, through Semantic's inherited box-sizing); Semantic's own rule beats a plain utility, hence !
const SELECTOR =
  'relative box-content! flex h-full w-[calc(100%-var(--spacing-3))] cursor-pointer flex-col flex-nowrap gap-(--spacing-2) rounded-[4px] border border-solid border-contrast-border pl-(--spacing-3) text-foreground hover:border-foreground max-sm:text-(length:--font-size-2)';

interface PokemonProps {
  encounter: TEncounter;
  foundPokemon: TPokemon;
}

const Pokemon = React.memo(function Pokemon({ encounter, foundPokemon }: PokemonProps) {
  const { t } = useTranslation('tracker');
  const changePokemon = useStore((state) => state.changePokemon);
  const duplicates = useStore(useCallback((state) => state.duplicates, []));
  const total = useStore(useShallow(selectTotal));
  const showAll = useStore(useCallback((state) => state.showAll, []));
  const suggestionsSettings = useStore(useCallback((state) => state.suggestions, []));
  const games = useStore(useCallback((state) => state.games, []));
  const showAllTooltip = useStore(useCallback((state) => state.showAllTooltip, []));
  const suggestions = useStore(useShallow(selectSuggestion));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
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
    <div className="relative row-span-2 flex h-full min-h-[7rem] flex-col flex-nowrap gap-(--spacing-1) font-bold">
      <div aria-label="Pokémon selector" className="flex flex-1 [&>div]:flex-1">
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
            <div className={SELECTOR} data-testid={`pokemon-${encounter.id}`}>
              <div className="flex h-[3.5rem] w-[4.8rem] items-end justify-center">
                <PkmImage name={foundPokemon.text} shiny={encounter?.details?.shiny} />
              </div>
              <span className="mt-auto mb-(--spacing-2)">
                {foundPokemon.text}
                {getGenderIcon(encounter?.details?.gender)}
              </span>
              <span className="absolute top-(--spacing-2) right-(--spacing-2)">
                Lv: {encounter?.details?.level ?? 0}
              </span>
            </div>
          ) : (
            <div className={SELECTOR} data-testid={`pokemon-${encounter.id}`}>
              <span
                className="m-auto text-placeholder"
                data-testid={`encounter-empty-${encounter.id}`}
              >
                Pokémon...
              </span>
            </div>
          )}
        </PokemonSelector>
      </div>
      {!!alertText && (
        <HoverPopover content={<b>{alertText}</b>}>
          {/* Semantic's red icon in the corner, as a button so the popup can open from it. Semantic's
              reset styles every <button>, so its font, size, line height and margin need ! */}
          <button
            aria-label={alertText}
            className="absolute top-0 right-0 m-0! ml-(--spacing-1)! inline-block h-[1em] w-[1.18em] cursor-pointer border-0 bg-transparent p-0 text-(length:--font-size-2)! leading-none! text-alert"
            data-testid={`alert-${encounter.id}`}
            type="button"
          >
            <TriangleAlert aria-hidden className="size-full" strokeWidth={2.5} />
          </button>
        </HoverPopover>
      )}
    </div>
  );
});

export default Pokemon;
