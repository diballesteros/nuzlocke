import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Dna,
  EllipsisVertical,
  Leaf,
  Monitor,
} from 'lucide-react';
import { EncounterSelector } from 'common';
import type { TEncounter, TPokemon } from 'constants/types';
import { useNatureOptions } from 'hooks/useNatures';
import useStore from 'store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  RepeatIcon,
  TrashIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { ROW_GHOST } from '../buttons';
import Detail from '../Detail/Detail';
import Evolve from '../Evolve/Evolve';
import { SWAPPABLE, useSwap } from '../Swap/Swap';

interface RowMenuProps {
  // What the menu also holds when the row has no room for it (compact rows)
  actions: { edit?: boolean; evolve?: boolean; level?: boolean; nature?: boolean; team?: boolean };
  boundary: HTMLElement | null;
  encounter: TEncounter;
  foundPokemon?: TPokemon;
  index: number;
  next?: TEncounter;
  onDelete: (returnFocus: HTMLElement | null) => void;
  onReset: (returnFocus: HTMLElement | null) => void;
  previous?: TEncounter;
  triggerClassName?: string;
}

// The row's ⋮ menu (5m): a Radix menu that arrow keys move through, Escape closes with focus back
// on ⋮, and that stays inside the list (flipping up near its bottom). It is non-modal: the page
// stays clickable, so a click outside or on ⋮ again closes it, as the old popover did. Choosing an
// item closes it, levelling included (the row's stepper is the quick way to level). In compact
// rows it also opens what the row has no room for: the team picker, Evolve, the natures, the editor
function RowMenu({
  actions,
  boundary,
  encounter,
  foundPokemon,
  index,
  next,
  onDelete,
  onReset,
  previous,
  triggerClassName,
}: RowMenuProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const changeLevel = useStore(useCallback((state) => state.changeLevel, []));
  const changeNature = useStore(useCallback((state) => state.changeNature, []));
  const moveEncounter = useStore(useCallback((state) => state.moveEncounter, []));
  const natureOptions = useNatureOptions();
  const { needsPicker, swap, team, teamSwap, text: swapText } = useSwap(encounter);
  const [picker, setPicker] = useState(false);
  const [evolve, setEvolve] = useState(false);
  const [edit, setEdit] = useState(false);
  // Compact rows pick a nature inside the menu: the Nature item turns the menu into the list of
  // natures, with a back item on top (a side submenu would cover the menu on a phone)
  const [natures, setNatures] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (natures) back.current?.focus();
  }, [natures]);
  const level = encounter?.details?.level ?? 0;
  const hasPokemon = !!encounter.pokemon;
  const showTeam = actions.team && hasPokemon && SWAPPABLE.includes(encounter.status?.value);
  const showEvolve = actions.evolve && !!foundPokemon?.evolve;
  const showNature = actions.nature && hasPokemon;
  const showEdit = actions.edit && hasPokemon;

  return (
    <>
      <DropdownMenu modal={false} onOpenChange={(open) => !open && setNatures(false)}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={t('encounter_options')}
            className={cn(ROW_GHOST, triggerClassName)}
            data-testid={`encounter-options-${index}`}
            ref={trigger}
            title={t('encounter_options')}
            type="button"
          >
            <EllipsisVertical aria-hidden strokeWidth={2.5} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          collisionBoundary={boundary}
          collisionPadding={4}
          // The menu is named by its row
          aria-label={encounter.location}
        >
          {natures ? (
            <>
              <DropdownMenuItem
                data-testid={`menu-nature-back-${index}`}
                onSelect={(e) => {
                  e.preventDefault();
                  setNatures(false);
                }}
                ref={back}
              >
                <ChevronLeft aria-hidden />
                {t('nature', { ns: 'common' })}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                onValueChange={(value) => changeNature(encounter.id, value)}
                value={encounter?.details?.nature ?? ''}
              >
                {natureOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.text}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </>
          ) : (
            <>
              <DropdownMenuLabel aria-hidden>
                {encounter.location}
                {hasPokemon && foundPokemon ? ` · ${foundPokemon.text}` : ''}
              </DropdownMenuLabel>
              {hasPokemon && actions.level && (
                <>
                  <DropdownMenuItem
                    data-testid={`level-up-${index}`}
                    onSelect={() => changeLevel(encounter.id, true)}
                  >
                    <ArrowUpIcon aria-hidden />
                    {t('level_up')} ({level})
                  </DropdownMenuItem>
                  {level > 1 && (
                    <DropdownMenuItem
                      data-testid={`level-down-${index}`}
                      onSelect={() => changeLevel(encounter.id, false)}
                    >
                      <ArrowDownIcon aria-hidden />
                      {t('level_down')} ({level})
                    </DropdownMenuItem>
                  )}
                </>
              )}
              {showTeam && (
                <DropdownMenuItem
                  data-testid={`menu-team-${index}`}
                  onSelect={() => (needsPicker ? setPicker(true) : swap())}
                >
                  {encounter.status?.value === 7 ? <Monitor aria-hidden /> : <Crown aria-hidden />}
                  {swapText}
                </DropdownMenuItem>
              )}
              {showEvolve && (
                <DropdownMenuItem
                  data-testid={`menu-evolve-${index}`}
                  onSelect={() => setEvolve(true)}
                >
                  <Dna aria-hidden className="-rotate-45" />
                  {t('evolve')}
                </DropdownMenuItem>
              )}
              {showNature && (
                <DropdownMenuItem
                  data-testid={`menu-nature-${index}`}
                  onSelect={(e) => {
                    e.preventDefault();
                    setNatures(true);
                  }}
                >
                  <Leaf aria-hidden />
                  {t('nature', { ns: 'common' })}
                  <ChevronRight aria-hidden className="ml-auto" />
                </DropdownMenuItem>
              )}
              {showEdit && (
                <DropdownMenuItem data-testid={`menu-edit-${index}`} onSelect={() => setEdit(true)}>
                  <PencilIcon aria-hidden />
                  {t('edit_details')}
                </DropdownMenuItem>
              )}
              {(!!previous || !!next) && <DropdownMenuSeparator />}
              {!!previous && (
                <DropdownMenuItem
                  data-testid={`move-up-${index}`}
                  onSelect={() => moveEncounter(encounter.id, previous.id)}
                >
                  <ChevronUpIcon aria-hidden />
                  {t('move_up', { ns: 'rules' })}
                </DropdownMenuItem>
              )}
              {!!next && (
                <DropdownMenuItem
                  data-testid={`move-down-${index}`}
                  onSelect={() => moveEncounter(encounter.id, next.id)}
                >
                  <ChevronDownIcon aria-hidden />
                  {t('move_down', { ns: 'rules' })}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid={`reset-encounter-${index}`}
                onSelect={() => onReset(trigger.current)}
                variant="destructive"
              >
                <RepeatIcon aria-hidden />
                {t('reset_2')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid={`delete-encounter-${index}`}
                onSelect={() => onDelete(trigger.current)}
                variant="destructive"
              >
                <TrashIcon aria-hidden />
                {t('delete')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* What compact rows open from the menu, with no buttons of their own */}
      {showTeam && needsPicker && (
        <EncounterSelector
          encounters={team}
          handleEncounter={teamSwap}
          onOpenChange={setPicker}
          open={picker}
          returnFocus={trigger}
        />
      )}
      {showEvolve && (
        <Evolve
          encounter={encounter}
          evolveIds={foundPokemon.evolve}
          onOpenChange={setEvolve}
          open={evolve}
          returnFocus={trigger}
          trigger={false}
        />
      )}
      {showEdit && (
        <Detail
          encounter={encounter}
          onOpenChange={setEdit}
          open={edit}
          returnFocus={trigger}
          trigger={false}
        />
      )}
    </>
  );
}

export default RowMenu;
