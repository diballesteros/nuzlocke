import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { List, RowComponentProps as RowProps, useListRef } from 'react-window';
import { EllipsisVertical } from 'lucide-react';
import { Status } from 'components';
import {
  Detail,
  Evolve,
  Nature,
  Nickname,
  Pokemon,
  ScrollList,
  Swap,
} from 'components/Tracker/elements';
import { TYPE_COLOR } from 'constants/colors';
import { POKEMAP } from 'constants/pokemon';
import useRemtoPx from 'hooks/useRemToPx';
import { selectNAGeneration } from 'selectors';
import useStore from 'store';
import PokeballSVG from 'assets/svg/pokeball.svg?react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowDownIcon, ArrowUpIcon, RepeatIcon, TrashIcon } from '@/components/ui/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { OUTLINE_BUTTON, RADIUS, ROW_ICON } from '../buttons';

const NICKNAME_HEIGHT = 15.714; // 220px
const NORMAL_HEIGHT = 12.857; // 180px

// A row: the header across both columns, then the Pokémon on the left beside the status and buttons
const ROW =
  'relative m-[var(--spacing-0)_var(--spacing-1)_var(--spacing-3)_var(--spacing-0)] grid h-fit grid-cols-[minmax(0,1fr)_minmax(0,1fr)] grid-rows-[auto_minmax(2.286rem,auto)_minmax(3.857rem,auto)] items-center gap-(--spacing-2) rounded-[4px] bg-card p-(--spacing-3) text-foreground shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] transition-all duration-500';
// The options menu's items, each with its icon at the end. The popup's text is translucent, so the
// icons are the one-path glyphs
const MENU_ITEM =
  'flex cursor-pointer gap-(--spacing-2) border-x-0 border-t-0 border-b border-solid border-foreground px-(--spacing-1) py-(--spacing-2) text-(length:--font-size-3) last:border-b-0 hover:bg-[grey] [&>svg]:ml-auto [&>svg]:block [&>svg]:h-[1em] [&>svg]:w-[1.18em]';

const Encounters = React.memo(function Encounters() {
  const { t } = useTranslation('tracker');
  const listRef = useListRef(null);
  const games = useStore(useCallback((state) => state.games, []));
  const text = useStore(useCallback((state) => state.text, []));
  const missing = useStore(useCallback((state) => state.missing, []));
  const gens = useStore(useCallback((state) => state.gens, []));
  const types = useStore(useCallback((state) => state.types, []));
  const nicknames = useStore(useCallback((state) => state.nicknames, []));
  const isNatureGen = useStore(selectNAGeneration);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const clearEncounter = useStore(useCallback((state) => state.clearEncounter, []));
  const deleteEncounter = useStore(useCallback((state) => state.deleteEncounter, []));
  const changeLevel = useStore(useCallback((state) => state.changeLevel, []));
  const [encounterToDelete, setEncounterToDelete] = useState<number>(null);
  const [confirm, setConfirm] = useState(false);
  const itemSize = useRemtoPx(nicknames ? NICKNAME_HEIGHT : NORMAL_HEIGHT);

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

  const handleClear = (encounterId: number) => {
    clearEncounter(encounterId);
  };

  const handleConfirm = (encounterId: number) => {
    setEncounterToDelete(encounterId);
    setConfirm(true);
  };

  const handleDelete = () => {
    deleteEncounter(encounterToDelete);
    setConfirm(false);
    setEncounterToDelete(null);
    toast.success('Successfully deleted encounter');
  };

  const handleScroll = (index: number) => {
    // react-window 2 throws on out-of-range rows; v1 clamped to the last one
    const lastRow = filteredEncounters.length - 1;
    listRef.current?.scrollToRow({ index: Math.min(index + 1, lastRow), align: 'center' });
  };

  const renderRow = ({ index, style }: RowProps) => {
    const encounter = filteredEncounters[index];
    const foundPokemon = POKEMAP.get(encounter.pokemon);
    const isGreyedOut = encounter?.status?.value === 2;
    return (
      <div style={style}>
        <div
          className={cn(
            ROW,
            encounter?.pokemon && 'border-[3px] border-solid',
            isGreyedOut && 'z-1 grayscale'
          )}
          data-testid={`encounter-${index}`}
          style={{
            borderImage: encounter?.pokemon
              ? `linear-gradient(to left, ${
                  TYPE_COLOR[foundPokemon?.dualtype || foundPokemon?.type]
                } , ${TYPE_COLOR[foundPokemon.type]}) 1`
              : undefined,
          }}
        >
          <div className="col-span-2 flex justify-between">
            <span className="block h-[1.429rem] min-h-[1.429rem] overflow-hidden font-bold text-ellipsis whitespace-nowrap">
              {encounter.location}
            </span>
            {/* The pencil and options buttons: no margin, at the row's smaller font size */}
            <div className="flex gap-(--spacing-1) [&>button]:mr-0! [&>button]:text-(length:--font-size-2)!">
              {!!encounter.pokemon && <Detail encounter={encounter} />}
              {/* Semantic's click Popup above the button, its right edge on the button's */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    aria-label="encounter-options"
                    className={RADIUS}
                    data-testid={`encounter-options-${index}`}
                    size="compact-icon"
                    type="button"
                    variant="basic"
                  >
                    <EllipsisVertical className={ROW_ICON} strokeWidth={2.5} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" arrowClassName="right-[1em] left-auto ml-0" edgeAligned>
                  <ul className="m-0 list-none p-0" role="menu">
                    {!!encounter.pokemon && (
                      <>
                        <li
                          aria-label="level up encounter"
                          className={MENU_ITEM}
                          data-testid={`level-up-${index}`}
                          onClick={() => changeLevel(encounter.id, true)}
                          role="presentation"
                        >
                          {t('level_up')} ({encounter?.details?.level ?? 0}) <ArrowUpIcon />
                        </li>
                        {encounter?.details?.level > 1 && (
                          <li
                            aria-label="decrease encounter level"
                            className={MENU_ITEM}
                            data-testid={`level-down-${index}`}
                            onClick={() => changeLevel(encounter.id, false)}
                            role="presentation"
                          >
                            {t('level_down')} ({encounter?.details?.level ?? 0}) <ArrowDownIcon />
                          </li>
                        )}
                      </>
                    )}
                    <li
                      aria-label="reset encounter"
                      className={MENU_ITEM}
                      data-testid={`reset-encounter-${index}`}
                      onClick={() => handleClear(encounter.id)}
                      role="presentation"
                    >
                      {t('reset_2')} <RepeatIcon />
                    </li>
                    <li
                      aria-label="delete encounter"
                      className={MENU_ITEM}
                      data-testid={`delete-encounter-${index}`}
                      onClick={() => handleConfirm(encounter.id)}
                      role="presentation"
                    >
                      {t('delete')} <TrashIcon />
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {nicknames && <Nickname encounterId={encounter.id} nickname={encounter.nickname} />}
          <Pokemon encounter={encounter} foundPokemon={foundPokemon} />
          <Status encounter={encounter} />
          <div className="flex items-center gap-(--spacing-2) self-center">
            {!!foundPokemon?.evolve && (
              <Evolve encounter={encounter} evolveIds={foundPokemon?.evolve} />
            )}
            {!!foundPokemon && [1, 3, 4, 7].includes(encounter.status?.value) && (
              <Swap encounter={encounter} />
            )}
            {!!foundPokemon && isNatureGen && <Nature encounter={encounter} />}
            <div className="flex items-center gap-(--spacing-2) max-md:[display:none]">
              {!!encounter.pokemon && (
                <>
                  <span>{t('level', { ns: 'rules' })}:</span>
                  <Button
                    aria-label="level-up-button"
                    className={OUTLINE_BUTTON}
                    data-testid={`level-up-button-${encounter.id}`}
                    onClick={() => changeLevel(encounter.id, true)}
                    size="icon"
                    title={t('level_up')}
                    type="button"
                    variant="secondary"
                  >
                    <ArrowUpIcon className={ROW_ICON} />
                  </Button>
                  <Button
                    aria-label="level-down-button"
                    className={OUTLINE_BUTTON}
                    data-testid={`level-down-button-${encounter.id}`}
                    onClick={() => changeLevel(encounter.id, false)}
                    size="icon"
                    title={t('level_down')}
                    type="button"
                    variant="secondary"
                  >
                    <ArrowDownIcon className={ROW_ICON} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col flex-nowrap gap-(--spacing-2)">
      {selectedGame ? (
        <>
          <div
            className="flex h-full flex-1 flex-col flex-nowrap overflow-hidden"
            data-testid="encounters-list"
          >
            <List
              rowComponent={renderRow}
              rowCount={filteredEncounters?.length}
              rowHeight={itemSize}
              listRef={listRef}
              rowProps={{}}
              style={{ height: 690, width: '100%' }}
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
        <DialogContent size="small">
          <DialogTitle className="sr-only">{t('confirm_delete', { ns: 'common' })}</DialogTitle>
          <DialogBody>{t('confirm_delete')}</DialogBody>
          <DialogFooter>
            <Button onClick={() => setConfirm(false)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleDelete} variant="primary">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Encounters;
