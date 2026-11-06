import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { List, RowComponentProps as RowProps, useListRef } from 'react-window';
import { Minus, Plus } from 'lucide-react';
import { Status } from 'components';
import { Evolve, Nature, Nickname, Pokemon, ScrollList, Swap } from 'components/Tracker/elements';
import Detail from 'components/Tracker/elements/Detail/Detail';
import { TYPE_COLOR } from 'constants/colors';
import { POKEMAP } from 'constants/pokemon';
import type { TEncounter, TPokemon } from 'constants/types';
import { selectNAGeneration } from 'selectors';
import useStore from 'store';
import PokeballSVG from 'assets/svg/pokeball.svg?react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { focusBack, TALL } from '../buttons';
import { SWAPPABLE } from '../Swap/Swap';
import RowMenu from './RowMenu';

// Row heights in px at the 14px root, scaled by the live root font size. Each includes the 4px gap
// below the card. Wide rows put everything on one line; narrow ones (phones, and lists under
// WIDE_REM) stack the location, the Pokémon and status, then the level and actions. Nicknames add
// a line, except on wide compact rows, where the field sits beside the Pokémon
const GAP = 4;
const HEIGHTS = {
  narrow: { compact: 56, compactNick: 96, normal: 120, normalNick: 160 },
  wide: { compact: 40, compactNick: 40, normal: 60, normalNick: 80 },
};
const WIDE_REM = 64; // 896px

// The list's size and the root font size, kept current through resizes and zoom
function useRowMetrics(list: HTMLElement | null) {
  const [metrics, setMetrics] = useState({ height: 0, rem: 14, width: 0 });
  // Measured before the first paint, so rows don't render once at the wrong size
  useLayoutEffect(() => {
    if (!list) return undefined;
    const measure = () =>
      setMetrics({
        height: list.getBoundingClientRect().height,
        rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
        width: list.getBoundingClientRect().width,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    // Zoom changes the root font size (so the rows' heights) without resizing the list
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [list]);
  return metrics;
}

// The level, between its − and + buttons. The number is announced as it changes
function LevelStepper({ className, encounter }: { className?: string; encounter: TEncounter }) {
  const { t } = useTranslation('tracker');
  const changeLevel = useStore(useCallback((state) => state.changeLevel, []));
  const step =
    'm-0! flex h-full w-[2.143rem] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-foreground outline-none hover:bg-foreground/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring [&_svg]:size-[1.143rem]';
  return (
    <div
      className={cn(
        'flex h-[2.286rem] w-[7.143rem] shrink-0 items-stretch justify-between rounded-md border border-solid border-contrast-border',
        className
      )}
    >
      <button
        aria-label={t('level_down')}
        className={cn(step, 'rounded-l-md')}
        data-testid={`level-down-button-${encounter.id}`}
        onClick={() => changeLevel(encounter.id, false)}
        title={t('level_down')}
        type="button"
      >
        <Minus aria-hidden strokeWidth={2.5} />
      </button>
      {/* An <output> is a polite live region (role="status") without aria-live, which the open
          Select's inert pass would keep live, along with the list around it */}
      <output className="flex items-center gap-(--spacing-1) font-bold tabular-nums">
        <span className="text-(length:--font-size-1) font-normal text-row-muted">Lv</span>
        {encounter?.details?.level ?? 0}
      </output>
      <button
        aria-label={t('level_up')}
        className={cn(step, 'rounded-r-md')}
        data-testid={`level-up-button-${encounter.id}`}
        onClick={() => changeLevel(encounter.id, true)}
        title={t('level_up')}
        type="button"
      >
        <Plus aria-hidden strokeWidth={2.5} />
      </button>
    </div>
  );
}

// The type colours as a stripe down the card's left edge: the first type over the second. An
// empty route's stripe is dashed; a fainted one is greyed
function Stripe({ fainted, pokemon }: { fainted: boolean; pokemon?: TPokemon }) {
  return (
    <div
      aria-hidden
      className={cn(
        'absolute inset-y-0 left-0 w-[4px] rounded-l-[6px]',
        !pokemon &&
          'bg-[repeating-linear-gradient(var(--color-contrast-border)_0_6px,transparent_6px_10px)]',
        fainted && 'opacity-50 grayscale'
      )}
      style={
        pokemon
          ? {
              background: `linear-gradient(${TYPE_COLOR[pokemon.type]} 0 50%, ${
                TYPE_COLOR[pokemon.dualtype || pokemon.type]
              } 50% 100%)`,
            }
          : undefined
      }
    />
  );
}

// What every row needs from the list. react-window renders rows with a stable component and these
// props, so a row stays mounted while the list re-renders or its encounter changes: an open menu
// or popover survives, and so does the focus on the row's buttons
interface RowData {
  compact: boolean;
  encounters: TEncounter[];
  isNatureGen: boolean;
  list: HTMLElement | null;
  nicknames: boolean;
  onDelete: (encounterId: number, returnFocus: HTMLElement | null) => void;
  onReset: (encounter: TEncounter, returnFocus: HTMLElement | null) => void;
  rem: number;
  wide: boolean;
}

function EncounterRow({
  ariaAttributes,
  compact,
  encounters,
  index,
  isNatureGen,
  list,
  nicknames,
  onDelete,
  onReset,
  rem,
  style,
  wide,
}: RowProps<RowData>) {
  const encounter = encounters[index];
  const foundPokemon = POKEMAP.get(encounter.pokemon);
  const fainted = encounter?.status?.value === 2;
  const hasPokemon = !!encounter.pokemon && !!foundPokemon;
  const canSwap = hasPokemon && SWAPPABLE.includes(encounter.status?.value);
  const canEvolve = hasPokemon && !!foundPokemon.evolve;
  const hasNature = hasPokemon && isNatureGen;
  const locationId = `encounter-location-${encounter.id}`;
  // Moving swaps places with the neighbour shown in the list, so it works while filtering too
  const previous = encounters[index - 1];
  const next = encounters[index + 1];
  const location = (className?: string) => (
    <span className={cn('truncate', className)} id={locationId} title={encounter.location}>
      {encounter.location}
    </span>
  );
  const menu = (actions: Parameters<typeof RowMenu>[0]['actions'], className?: string) => (
    <RowMenu
      actions={{ level: true, ...actions }}
      boundary={list}
      encounter={encounter}
      foundPokemon={foundPokemon}
      index={index}
      next={next}
      onDelete={(el) => onDelete(encounter.id, el)}
      onReset={(el) => onReset(encounter, el)}
      previous={previous}
      triggerClassName={className}
    />
  );
  const nickname = (className?: string, tall?: boolean) =>
    nicknames && (
      <Nickname
        className={className}
        encounterId={encounter.id}
        nickname={encounter.nickname}
        tall={tall}
      />
    );
  const pokemon = (props: Partial<Parameters<typeof Pokemon>[0]> = {}) => (
    <Pokemon encounter={encounter} fainted={fainted} foundPokemon={foundPokemon} {...props} />
  );
  // Fixed slots keep the columns in line when a row has no such action
  const slot = (show: boolean, node: React.ReactNode, widthClass: string) =>
    show ? node : <span aria-hidden className={cn('shrink-0', widthClass)} />;

  let content: React.ReactNode;
  if (wide && !compact) {
    content = (
      <div className="grid h-full grid-cols-[minmax(0,9.286rem)_minmax(10.714rem,1fr)_7.143rem_9.714rem_auto_auto] items-center gap-x-(--spacing-3) pr-(--spacing-2) pl-(--spacing-4)">
        {location('text-(length:--font-size-2) text-row-muted')}
        <div className="flex min-w-0 flex-col gap-(--spacing-1)">
          {pokemon()}
          {hasPokemon && nickname()}
        </div>
        {slot(hasPokemon, <LevelStepper encounter={encounter} />, 'w-[7.143rem]')}
        <Status encounter={encounter} />
        <div className="flex items-center gap-(--spacing-2)">
          {slot(canSwap, <Swap encounter={encounter} />, 'w-[6rem]')}
          {slot(
            canEvolve,
            <Evolve encounter={encounter} evolveIds={foundPokemon?.evolve} />,
            'w-[2.286rem]'
          )}
          {isNatureGen && slot(hasNature, <Nature encounter={encounter} />, 'w-[7.857rem]')}
        </div>
        <div className="flex items-center gap-(--spacing-0)">
          {slot(hasPokemon, <Detail encounter={encounter} />, 'w-[2.286rem]')}
          {menu({})}
        </div>
      </div>
    );
  } else if (wide) {
    content = (
      <div className="grid h-full grid-cols-[minmax(0,9.286rem)_minmax(10rem,1fr)_7.143rem_9.714rem_auto] items-center gap-x-(--spacing-3) pr-(--spacing-1) pl-(--spacing-3)">
        {location('text-(length:--font-size-2) text-row-muted')}
        <div className="flex min-w-0 items-center gap-(--spacing-2)">
          {pokemon({ compact: true })}
          {/* At the column's end, so the fields line up whatever the name's length */}
          {hasPokemon && nickname('ml-auto w-[9rem] shrink-0')}
        </div>
        {slot(hasPokemon, <LevelStepper encounter={encounter} />, 'w-[7.143rem]')}
        <Status encounter={encounter} />
        <div className="flex items-center gap-(--spacing-1)">
          {slot(canSwap, <Swap encounter={encounter} iconOnly />, 'w-[2.286rem]')}
          {menu({ edit: true, evolve: true, nature: isNatureGen })}
        </div>
      </div>
    );
  } else if (!compact) {
    content = (
      <div
        className={cn(
          'grid h-full grid-cols-[minmax(0,1fr)_10rem] content-center gap-x-(--spacing-2) gap-y-(--spacing-1) py-(--spacing-1) pr-(--spacing-1) pl-(--spacing-3)',
          nicknames && hasPokemon
            ? 'grid-rows-[2rem_2.857rem_2.571rem_2.571rem]'
            : 'grid-rows-[2rem_2.857rem_2.571rem]'
        )}
      >
        <div className="col-span-2 flex min-w-0 items-center">
          {location('flex-1 text-(length:--font-size-2) font-bold')}
          {hasPokemon && <Detail className="size-[2.571rem]" encounter={encounter} />}
          {menu({}, 'size-[2.571rem]')}
        </div>
        {pokemon()}
        <Status encounter={encounter} triggerClassName={TALL} />
        {hasPokemon && nickname('col-span-2 [&_input]:h-[2.571rem]! [&>button]:size-[2.571rem]!')}
        {hasPokemon && (
          <div className="col-span-2 flex min-w-0 items-center gap-(--spacing-2)">
            <LevelStepper className="h-[2.571rem]" encounter={encounter} />
            <span className="flex-1" />
            {canSwap && <Swap className="h-[2.571rem]" encounter={encounter} />}
            {canEvolve && (
              <Evolve
                className="size-[2.571rem]"
                encounter={encounter}
                evolveIds={foundPokemon.evolve}
              />
            )}
            {hasNature && <Nature encounter={encounter} iconOnly triggerClassName="h-[2.571rem]" />}
          </div>
        )}
      </div>
    );
  } else {
    content = (
      <div
        className={cn(
          'grid h-full grid-cols-[minmax(0,1fr)_8.429rem_auto] content-center items-center gap-x-(--spacing-1) gap-y-(--spacing-1) py-[0.429rem] pr-(--spacing-0) pl-(--spacing-3)',
          nicknames && hasPokemon && 'grid-rows-[3.143rem_2.571rem]'
        )}
      >
        {pokemon({
          compact: true,
          level: true,
          sub: location('text-(length:--font-size-1) font-normal text-row-muted'),
        })}
        <Status encounter={encounter} triggerClassName={TALL} />
        {menu(
          { edit: true, evolve: true, nature: isNatureGen, team: true },
          'h-[3.143rem] w-[2.857rem]'
        )}
        {hasPokemon && nickname('col-span-3 [&_input]:h-[2.571rem]! [&>button]:size-[2.571rem]!')}
      </div>
    );
  }

  return (
    <div style={style} {...ariaAttributes} aria-labelledby={locationId}>
      <div
        className="relative rounded-[6px] border border-solid border-contrast-border bg-card text-foreground"
        data-testid={`encounter-${index}`}
        style={{
          height: `calc(100% - ${(GAP * rem) / 14}px)`,
          ['--t1' as string]: foundPokemon ? TYPE_COLOR[foundPokemon.type] : undefined,
        }}
      >
        <Stripe fainted={fainted} pokemon={foundPokemon} />
        {content}
      </div>
    </div>
  );
}

const Encounters = React.memo(function Encounters() {
  const { t } = useTranslation('tracker');
  const listRef = useListRef(null);
  const [listEl, setListEl] = useState<HTMLDivElement | null>(null);
  const games = useStore(useCallback((state) => state.games, []));
  const text = useStore(useCallback((state) => state.text, []));
  const missing = useStore(useCallback((state) => state.missing, []));
  const gens = useStore(useCallback((state) => state.gens, []));
  const types = useStore(useCallback((state) => state.types, []));
  const nicknames = useStore(useCallback((state) => state.nicknames, []));
  const compact = useStore(useCallback((state) => state.compact, []));
  const isNatureGen = useStore(selectNAGeneration);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const clearEncounter = useStore(useCallback((state) => state.clearEncounter, []));
  const deleteEncounter = useStore(useCallback((state) => state.deleteEncounter, []));
  const [encounterToDelete, setEncounterToDelete] = useState<number>(null);
  const [confirm, setConfirm] = useState(false);
  const [encounterToReset, setEncounterToReset] = useState<TEncounter>(null);
  const { height: listHeight, rem, width } = useRowMetrics(listEl);
  const scrollTarget = useRef<number>(null);
  const wide = width >= WIDE_REM * rem;
  const heights = HEIGHTS[wide ? 'wide' : 'narrow'];
  const height =
    heights[`${compact ? 'compact' : 'normal'}${nicknames ? 'Nick' : ''}` as keyof typeof heights];
  const itemSize = ((height + GAP) * rem) / 14;

  const filteredEncounters = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      const upperCase = text?.toUpperCase();
      const foundPokemon = POKEMAP.get(enc.pokemon);
      return (
        (enc.location.toUpperCase()?.includes(upperCase) ||
          enc.status?.text.toUpperCase()?.includes(upperCase) ||
          enc.nickname?.toUpperCase()?.includes(upperCase) ||
          foundPokemon?.text?.toUpperCase()?.includes(upperCase)) &&
        (gens.length > 0 ? gens.includes(foundPokemon?.generation) : true) &&
        (types.length > 0
          ? types.includes(foundPokemon?.type) || types.includes(foundPokemon?.dualtype)
          : true) &&
        (!missing || (missing && (!enc.pokemon || !enc.status)))
      );
    });
  }, [games, gens, missing, selectedGame, text, types]);

  // The confirms hand focus back to the ⋮ they were opened from
  const [confirmFrom, setConfirmFrom] = useState<HTMLElement | null>(null);
  const backToMenu = (e: Event) => focusBack(e, confirmFrom);
  const onDelete = useCallback((encounterId: number, returnFocus: HTMLElement | null) => {
    setConfirmFrom(returnFocus);
    setEncounterToDelete(encounterId);
    setConfirm(true);
  }, []);
  const onReset = useCallback((encounter: TEncounter, returnFocus: HTMLElement | null) => {
    setConfirmFrom(returnFocus);
    setEncounterToReset(encounter);
  }, []);
  const rowProps = useMemo<RowData>(
    () => ({
      compact,
      encounters: filteredEncounters,
      isNatureGen,
      list: listEl,
      nicknames,
      onDelete,
      onReset,
      rem,
      wide,
    }),
    [compact, filteredEncounters, isNatureGen, listEl, nicknames, onDelete, onReset, rem, wide]
  );

  const handleDelete = () => {
    deleteEncounter(encounterToDelete);
    // The row is gone: its ⋮ now belongs to the next one
    setConfirmFrom(null);
    setConfirm(false);
    setEncounterToDelete(null);
    toast.success('Successfully deleted encounter');
  };

  const handleReset = () => {
    clearEncounter(encounterToReset.id);
    setEncounterToReset(null);
  };

  // The list fills the page, and the location list takes its place while open, so a row picked
  // there is scrolled to once the list has its height back
  const rowCount = filteredEncounters?.length ?? 0;
  const scrollToRow = useCallback(
    (index: number) => {
      // react-window 2 throws on out-of-range rows; v1 clamped to the last one. The location list
      // only offers rows that exist, so there is always one
      listRef.current?.scrollToRow({ index: Math.min(index + 1, rowCount - 1), align: 'center' });
    },
    [rowCount, listRef]
  );
  const handleScroll = (index: number) => {
    if (listEl && listEl.getBoundingClientRect().height > 0) scrollToRow(index);
    else scrollTarget.current = index;
  };
  useEffect(() => {
    if (scrollTarget.current == null || listHeight === 0) return;
    scrollToRow(scrollTarget.current);
    scrollTarget.current = null;
  }, [listHeight, scrollToRow]);

  return (
    <div className="flex min-h-0 flex-1 flex-col flex-nowrap gap-(--spacing-2)">
      {selectedGame ? (
        <>
          <div
            className="flex min-h-0 flex-1 flex-col flex-nowrap overflow-hidden"
            data-testid="encounters-list"
            ref={setListEl}
          >
            <List
              // Room after the last row for the phones' floating button
              className="max-sm:pb-[5.143rem]"
              listRef={listRef}
              rowComponent={EncounterRow}
              rowCount={filteredEncounters?.length}
              rowHeight={itemSize}
              rowProps={rowProps}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          <ScrollList encounters={filteredEncounters} scrollTo={handleScroll} />
        </>
      ) : (
        <div className="flex h-[71.429rem] max-h-[71.429rem] min-h-[71.429rem] flex-1 flex-col flex-nowrap items-center gap-(--spacing-4)">
          <PokeballSVG className="mt-(--spacing-5) w-1/2 max-w-[25.714rem] [&_path]:fill-foreground" />
          <span className="text-(length:--font-size-7) font-bold text-foreground">
            {t('please_select', { ns: 'common' })}
          </span>
        </div>
      )}
      {/* Semantic's Confirm */}
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent size="small" onCloseAutoFocus={backToMenu}>
          <DialogTitle className="sr-only">{t('confirm_delete', { ns: 'common' })}</DialogTitle>
          <DialogBody>{t('confirm_delete')}</DialogBody>
          <DialogFooter>
            <Button onClick={() => setConfirm(false)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleDelete} variant="solid-red">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Reset asks first, like Delete; it names the route it clears */}
      <Dialog open={!!encounterToReset} onOpenChange={(open) => !open && setEncounterToReset(null)}>
        <DialogContent size="small" onCloseAutoFocus={backToMenu}>
          <DialogHeader>{t('confirm_reset_title')}</DialogHeader>
          <DialogBody>
            {t('confirm_reset', { location: encounterToReset?.location ?? '' })}
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setEncounterToReset(null)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button data-testid="confirm-reset-encounter" onClick={handleReset} variant="solid-red">
              {t('reset_2')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Encounters;
