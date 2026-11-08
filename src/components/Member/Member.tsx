import { ABILITIES } from '@smogon/calc';
import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemSelector, PkmImage } from 'common';
import { MoveSelector, Natures, PokemonType } from 'components';
import { ROW_CONTROL, ROW_ICON_CONTROL, TOOLBAR_DANGER } from 'components/Tracker/elements/buttons';
import { TYPE_COLOR } from 'constants/colors';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail } from 'constants/types';
import { useNatureOptions } from 'hooks/useNatures';
import useStore from 'store';
import { Combobox } from '@/components/ui/combobox';
import { ChevronDownIcon, TrashIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const ABILITY_OPTIONS = [...new Set(ABILITIES[8])].map((smogonAbility) => {
  return { text: smogonAbility, value: smogonAbility };
});

// A member's card (5t), in the encounter editor's style: a header with the sprite on a tile of its
// type, the name, the types and a ▾, then captioned fields and the move tiles.
// The header's button stretches over the whole header (its ::after), so a click anywhere opens the
// card; the type chips are buttons of their own (the type dialog) and sit above it
const HEADER =
  'relative flex items-center gap-(--spacing-3) rounded-lg px-(--spacing-3) py-(--spacing-2) hover:bg-foreground/5 has-[button[aria-expanded]:focus-visible]:outline-2 has-[button[aria-expanded]:focus-visible]:-outline-offset-2 has-[button[aria-expanded]:focus-visible]:outline-row-ring';
const SPRITE =
  'flex size-[3.429rem] shrink-0 items-center justify-center rounded-lg border border-solid border-[color-mix(in_srgb,var(--t1,transparent)_35%,transparent)] bg-[color-mix(in_srgb,var(--t1,transparent)_19%,transparent)] dark:bg-[color-mix(in_srgb,var(--t1,transparent)_10%,transparent)]';
// The fields are the direct children of `team-details-*` in the specs' order (nature, ability,
// item, moves 1-4, delete), placed by its grid: two columns on phones (nature across, ability
// beside item, one move a row), six from 640px (three fields, two moves a row)
const DETAILS =
  'grid grid-cols-2 gap-x-(--spacing-3) gap-y-(--spacing-2) border-0 border-t border-solid border-contrast-border p-(--spacing-3) sm:grid-cols-6';
const FIELD = 'flex min-w-0 flex-col gap-(--spacing-1)';
const CAPTION = 'text-(length:--font-size-1) leading-[1.4] font-bold text-row-muted';
// Room above the first row of moves (the first slot, and the second from 640px) for the "Moves"
// caption, which the first slot holds
const UNDER_CAPTION = 'mt-[calc(1.4*var(--font-size-1)+var(--spacing-2))]';
const SM_UNDER_CAPTION = 'sm:mt-[calc(1.4*var(--font-size-1)+var(--spacing-2))]';
const INFO = cn(ROW_ICON_CONTROL, 'text-row-muted shadow-none');
// Outlined in red, its text darkened to pass contrast on the card (the Calculator's Reset)
const DELETE = cn(
  ROW_CONTROL,
  TOOLBAR_DANGER,
  'col-span-full mt-(--spacing-1) h-[2.571rem] gap-(--spacing-2) justify-self-end px-(--spacing-3) text-[color-mix(in_srgb,var(--color-destructive)_78%,black)] dark:text-[color-mix(in_srgb,var(--color-red-inverted)_70%,white)]'
);

interface MemberProps {
  index: number;
  pokemonDetail: PokemonDetail;
}

function Member({ index, pokemonDetail }: MemberProps): React.JSX.Element {
  const { t } = useTranslation('builder');
  const natureOptions = useNatureOptions();
  const pokemon = POKEMAP.get(pokemonDetail.id);
  const changeTeamMember = useStore(useCallback((state) => state.changeTeamMember, []));
  const deleteTeamMember = useStore(useCallback((state) => state.deleteTeamMember, []));
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  const setMove = (slot: number, moveId: number) => {
    const moves = [0, 1, 2, 3].map((i) => pokemonDetail.moves[i]);
    moves[slot] = moveId;
    changeTeamMember(index, { ...pokemonDetail, moves });
  };

  return (
    <div
      className="shrink-0 rounded-lg border border-solid border-contrast-border bg-card text-foreground"
      data-testid={`team-poke-${pokemon.text}`}
      style={{ ['--t1' as string]: TYPE_COLOR[pokemon.type] }}
    >
      <div className={HEADER}>
        <div aria-hidden className={SPRITE}>
          <PkmImage name={pokemon?.text} />
        </div>
        {/* The name, then the types: beside it from 640px, under it on phones */}
        <div className="flex min-w-0 flex-1 items-center gap-(--spacing-3) max-sm:flex-col max-sm:items-start max-sm:gap-(--spacing-1)">
          <button
            aria-controls={detailsId}
            aria-expanded={expanded}
            className="max-w-full min-w-0 flex-1 cursor-pointer truncate border-0 bg-transparent p-0 text-left text-(length:--font-size-4) leading-[1.4] font-bold text-foreground outline-none after:absolute after:inset-0 after:content-['']"
            data-testid={`expand-${pokemon.text}`}
            onClick={() => setExpanded((prevState) => !prevState)}
            type="button"
          >
            {pokemon.text}
          </button>
          <div className="relative z-1 shrink-0">
            <PokemonType pokemon={pokemon} />
          </div>
        </div>
        <ChevronDownIcon
          aria-hidden
          className={cn(
            'size-[1.143rem] shrink-0 text-row-muted transition-transform duration-150 motion-reduce:transition-none',
            expanded && 'rotate-180'
          )}
        />
      </div>
      {/* A closed card's fields are `hidden` (preflight makes it display: none), so Tab and screen
          readers never reach them. They stay in the page: the state journey deletes a closed
          member by its button */}
      <div
        className={DETAILS}
        data-testid={`team-details-${pokemon.text}`}
        hidden={!expanded}
        id={detailsId}
      >
        <div className={cn(FIELD, 'col-span-2')}>
          <span aria-hidden className={CAPTION}>
            {t('nature', { ns: 'tracker' })}
          </span>
          <div className="flex gap-(--spacing-2)">
            <Combobox
              aria-label={t('nature', { ns: 'tracker' })}
              className="min-w-0 flex-1"
              data-testid={`team-nature-${pokemon?.text}`}
              look="row"
              onChange={(nature) => changeTeamMember(index, { ...pokemonDetail, nature })}
              options={natureOptions}
              placeholder={t('select_nature', { ns: 'calculator' })}
              value={pokemonDetail.nature ?? ''}
            />
            <Natures className={INFO} label={t('nature_chart', { ns: 'common' })} />
          </div>
        </div>
        <div className={cn(FIELD, 'sm:col-span-2')}>
          <span aria-hidden className={CAPTION}>
            {t('ability', { ns: 'tracker' })}
          </span>
          <Combobox
            aria-label={t('ability', { ns: 'tracker' })}
            data-testid={`team-ability-${pokemon?.text}`}
            look="row"
            onChange={(ability) => changeTeamMember(index, { ...pokemonDetail, ability })}
            options={ABILITY_OPTIONS}
            placeholder={t('select_ability', { ns: 'calculator' })}
            value={pokemonDetail.ability ?? ''}
          />
        </div>
        <div className={cn(FIELD, 'sm:col-span-2')}>
          <span aria-hidden className={CAPTION}>
            {t('item', { ns: 'calculator' })}
          </span>
          <ItemSelector
            aria-label={t('item', { ns: 'calculator' })}
            dataTestId={`team-item-${pokemon?.text}`}
            item={pokemonDetail.item}
            look="row"
            onChange={(newItem) => changeTeamMember(index, { ...pokemonDetail, item: newItem })}
          />
        </div>
        {[0, 1, 2, 3].map((slot) => (
          <div
            className={cn(
              'relative col-span-2 min-w-0 sm:col-span-3',
              slot === 0 && UNDER_CAPTION,
              slot === 1 && SM_UNDER_CAPTION
            )}
            key={slot}
          >
            {slot === 0 && (
              <span
                aria-hidden
                className={cn(CAPTION, 'absolute bottom-full left-0 mb-(--spacing-1)')}
              >
                {t('moves', { ns: 'tracker' })}
              </span>
            )}
            <MoveSelector
              boldName
              currentMoveId={pokemonDetail?.moves?.[slot] ?? null}
              handleMove={(moveId: number) => setMove(slot, moveId)}
              look="tile"
              slot={t('move_slot', { n: slot + 1, ns: 'tracker' })}
            />
          </div>
        ))}
        <button
          className={DELETE}
          data-testid={`delete-team-${index}`}
          onClick={() => {
            deleteTeamMember(index);
            // The button goes with its card: focus moves to the card that takes its place, else
            // the one before, else the + button
            setTimeout(() => {
              const heads = document.querySelectorAll<HTMLElement>(
                'button[data-testid^="expand-"]'
              );
              (
                heads[index] ??
                heads[index - 1] ??
                document.querySelector<HTMLElement>('[data-testid="builder-add"]')
              )?.focus();
            });
          }}
          type="button"
        >
          <TrashIcon aria-hidden />
          {t('delete_member', { name: pokemon.text })}
        </button>
      </div>
    </div>
  );
}

export default Member;
