import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { TriangleAlert } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { PkmImage, PokemonSelector } from 'common';
import { getGenderIcon } from 'components/PokeInfo/PokeInfo';
import POKEMON, { POKEMAP } from 'constants/pokemon';
import type { TEncounter, TPokemon } from 'constants/types';
import { inVersion } from 'constants/versions';
import useExclusives from 'hooks/useExclusives';
import useFilters from 'hooks/useFilters';
import { selectSuggestion, selectTotal } from 'selectors';
import useStore from 'store';
import { HoverPopover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// The row's Pokémon (5m): the sprite on a faint tile of its first type (the row sets --t1) and the
// name, as one button that opens the selector. Fainted greys and dims the sprite and strikes the name
const BUTTON =
  'm-0! flex min-w-0 flex-1 cursor-pointer items-center rounded-md border border-solid border-transparent bg-transparent p-[2px] pr-(--spacing-2) text-left [font-family:inherit]! text-(length:--font-size-3)! leading-tight! text-foreground outline-none hover:border-contrast-border hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring';
const SPRITE =
  '[&>div]:[transform:none]! flex shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--t1,transparent)_12%,transparent)] dark:bg-[color-mix(in_srgb,var(--t1,transparent)_6%,transparent)]';

interface PokemonProps {
  // Compact rows: a smaller sprite
  compact?: boolean;
  encounter: TEncounter;
  fainted?: boolean;
  foundPokemon: TPokemon;
  // Shown after the name (the level, on phones in compact mode)
  level?: boolean;
  // A second line under the name (the location, on phones in compact mode)
  sub?: React.ReactNode;
}

const Pokemon = React.memo(function Pokemon({
  compact = false,
  encounter,
  fainted = false,
  foundPokemon,
  level = false,
  sub,
}: PokemonProps) {
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
  const version = games[selectedGame?.value]?.version;
  const exclusives = useExclusives(!!version);
  const filters = useFilters();
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

  // The location's table, less what the run's version doesn't have (constants/versions). The
  // encounter's own Pokémon always stays, as before
  const filter = useMemo(() => {
    return encounter?.filterKey && !showAll
      ? POKEMON.reduce((filtered, poke) => {
          if (
            (filters?.[encounter?.filterKey]?.includes(poke.text) &&
              inVersion(exclusives, encounter.filterKey, poke.text, version)) ||
            encounter.pokemon === poke.value
          ) {
            filtered.push(poke.value);
          }
          return filtered;
        }, [])
      : false;
  }, [encounter, exclusives, filters, showAll, version]);

  const onChange = (pokemonId: number) => {
    changePokemon(encounter.id, pokemonId);
    const alert = getAlertText(pokemonId);
    if (!!alert && !toast.isActive(alert)) {
      toast.warn(RULE_ALERTS[alert], { toastId: alert });
    }
  };

  const sprite = cn(
    SPRITE,
    compact ? 'size-[2.143rem]' : 'size-[2.857rem]',
    fainted && 'bg-transparent! opacity-45 grayscale',
    !encounter?.pokemon && 'border border-dashed border-contrast-border bg-transparent'
  );

  return (
    <div className="flex min-w-0 items-center gap-(--spacing-1)">
      <PokemonSelector
        button={{
          'aria-label': `${encounter?.pokemon ? foundPokemon.text : 'Pokémon...'}, ${t('change_pokemon')}`,
          className: BUTTON,
        }}
        dupes={total?.map((c) => c.pokemon)}
        filter={filter}
        handlePokemon={onChange}
        suggestions={filter && suggestions && suggestionsSettings && !showAll ? suggestions : false}
        tooltip={showAllTooltip}
      >
        <span
          className="flex min-w-0 flex-1 items-center gap-(--spacing-2)"
          data-testid={`pokemon-${encounter.id}`}
        >
          {encounter?.pokemon ? (
            <>
              <span className={sprite}>
                <PkmImage name={foundPokemon.text} shiny={encounter?.details?.shiny} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-bold">
                  <span className={cn(fainted && 'text-row-muted line-through')}>
                    {foundPokemon.text}
                  </span>
                  <span className={cn('font-normal', fainted && 'text-row-muted')}>
                    {getGenderIcon(encounter?.details?.gender)}
                    {level && (
                      <span className="ml-(--spacing-1) text-(length:--font-size-1) text-row-muted">
                        Lv {encounter?.details?.level ?? 0}
                      </span>
                    )}
                  </span>
                </span>
                {sub}
              </span>
            </>
          ) : (
            <>
              <span className={sprite} />
              <span className="flex min-w-0 flex-col">
                <span
                  className="truncate text-row-muted italic"
                  data-testid={`encounter-empty-${encounter.id}`}
                >
                  Pokémon...
                </span>
                {sub}
              </span>
            </>
          )}
        </span>
      </PokemonSelector>
      {!!alertText && (
        <HoverPopover content={<b>{alertText}</b>}>
          <button
            aria-label={alertText}
            className="m-0! inline-flex size-[1.714rem] shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-alert outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring"
            data-testid={`alert-${encounter.id}`}
            type="button"
          >
            <TriangleAlert aria-hidden className="size-[1.143rem]" strokeWidth={2.5} />
          </button>
        </HoverPopover>
      )}
    </div>
  );
});

export default Pokemon;
