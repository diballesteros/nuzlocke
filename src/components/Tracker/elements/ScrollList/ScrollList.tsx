import { useCallback, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SquareMenu } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import type { TEncounter } from 'constants/types';
import { selectCaught, selectFailed, selectFainted } from 'selectors';
import useStore from 'store';
import CaughtSVG from 'assets/svg/caught.svg?react';
import FailedSVG from 'assets/svg/failed.svg?react';
import FaintedSVG from 'assets/svg/fainted.svg?react';
import TeamSVG from 'assets/svg/team.svg?react';
import { Button, MINI_BUTTON, TOGGLE_BUTTON } from '@/components/ui/button';
import { ArrowRightIcon, EyeIcon, EyeOffIcon, PencilIcon, XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { RADIUS, ROW_ICON } from '../buttons';

// The notes and the location list open above the tracker in the same frame. It's a <nav> for the
// list, which Semantic's reset makes a block, so its flex needs !
const PANEL =
  'flex! h-full flex-col flex-nowrap overflow-auto rounded-[4px] border-2 border-b-0 border-solid border-contrast-border p-(--spacing-2) text-foreground';
const PANEL_HEADER =
  'flex flex-col flex-nowrap border-x-0 border-t-0 border-b border-dashed border-contrast-border pb-(--spacing-2)';
const PANEL_TITLE =
  'flex items-center justify-between [&>p]:m-0! [&>p]:text-(length:--font-size-3)';
// The notes and list toggles (Semantic's `mini compact` inverted toggles): pressed and focused in
// dark mode, they keep Semantic's inverted focus ring
const PANEL_TOGGLE = cn(
  MINI_BUTTON,
  RADIUS,
  TOGGLE_BUTTON,
  'dark:aria-pressed:focus:shadow-[inset_0_0_0_2px_var(--color-inverted-focus)]!'
);
// Semantic's `mini basic icon` button that closes either panel
const CLOSE = cn(MINI_BUTTON, RADIUS);

interface ScrollListProps {
  encounters: TEncounter[];
  scrollTo: (index: number) => void;
}

function ScrollList({ encounters, scrollTo }: ScrollListProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const notes = useStore(useCallback((state) => state.notes, []));
  const skipped = useStore(useCallback((state) => state.skipped, []));
  const changeNotes = useStore(useCallback((state) => state.changeNotes, []));
  const addSkipped = useStore(useCallback((state) => state.addSkipped, []));
  const deleteSkipped = useStore(useCallback((state) => state.deleteSkipped, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const fainted = useStore(useShallow(selectFainted));
  const failed = useStore(useShallow(selectFailed));
  const caught = useStore(useShallow(selectCaught));
  const [open, setOpen] = useState<'SCROLL_LIST' | 'NOTES' | null>(null);
  const listTitle = useId();

  const lastEncounter = useMemo(() => {
    const index = encounters?.findIndex(
      (enc, i) => !enc.pokemon && !skipped[selectedGame?.value]?.includes(i)
    );
    return index > -1 ? index : encounters.length - 1;
  }, [encounters, selectedGame, skipped]);

  const getStatusSVG = (enc: TEncounter) => {
    switch (enc?.status?.value) {
      case 1:
      case 3:
      case 4:
        return <CaughtSVG />;
      case 2:
        return <FaintedSVG />;
      case 5:
        return <FailedSVG />;
      case 7:
        return (
          <>
            <CaughtSVG />
            <TeamSVG style={{ marginLeft: 'var(--spacing-1)' }} />
          </>
        );
      default:
        return null;
    }
  };

  const handleClick = (index: number) => {
    scrollTo(index);
    setOpen(null);
  };

  const toggleScrollList = () => {
    setOpen(open === 'SCROLL_LIST' ? null : 'SCROLL_LIST');
  };

  const toggleNotes = () => {
    setOpen(open === 'NOTES' ? null : 'NOTES');
  };

  const onSkip = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    addSkipped(index);
  };

  const onDeleteSkip = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    deleteSkipped(index);
  };

  return (
    <>
      {open === 'SCROLL_LIST' && (
        <nav aria-labelledby={listTitle} className={PANEL}>
          <div className={PANEL_HEADER}>
            <div className={PANEL_TITLE}>
              <p id={listTitle}>{t('click_on_any_location')}</p>
              <Button
                aria-label="close-scroll-list"
                className={CLOSE}
                data-testid="close-scroll-list"
                onClick={() => setOpen(null)}
                size="icon"
                variant="basic"
              >
                <XIcon className={ROW_ICON} />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-(--spacing-3) font-bold [&>svg]:size-(--spacing-5)">
              <CaughtSVG />
              {caught?.length || 0}
              <FaintedSVG />
              {fainted?.length || 0}
              <FailedSVG />
              {failed?.length || 0}
            </div>
          </div>
          <ol className="my-[1em] list-decimal overflow-auto pl-[40px] text-(length:--font-size-4)">
            {encounters.map((encounter, index) => {
              const isSkipped = skipped[selectedGame?.value]?.includes(index);
              // A click anywhere on the item scrolls to it, as before; the location is a button
              // so the keyboard can reach it, and its click bubbles up to here
              return (
                <li
                  aria-label={`scroll-to-encounter-${index}`}
                  className={cn(
                    'mb-(--spacing-2) cursor-pointer pl-(--spacing-3) hover:bg-badgeopac hover:font-bold',
                    index === lastEncounter && 'bg-badgeopac font-bold'
                  )}
                  data-testid={`scroll-to-encounter-${index}`}
                  key={encounter.id}
                  onClick={() => handleClick(index)}
                >
                  <div className="flex items-center justify-between">
                    <button
                      className="m-0 cursor-pointer appearance-none border-0 bg-transparent p-0 text-start [font:inherit] [letter-spacing:inherit] text-inherit [&>span]:mr-(--spacing-2) [&>svg]:inline [&>svg]:size-(--spacing-4) [&>svg]:align-baseline"
                      type="button"
                    >
                      <span>{encounter.location}</span>
                      {getStatusSVG(encounter)}
                    </button>
                    {/* Semantic's `basic` button without `inverted`: the light look in both themes */}
                    <Button
                      aria-label={`skip-encounter-${index}`}
                      aria-pressed={!!isSkipped}
                      className={cn(
                        RADIUS,
                        'dark:text-button-foreground dark:shadow-[inset_0_0_0_1px_var(--color-field-border)] dark:hover:bg-white dark:hover:text-button-hover-foreground dark:hover:shadow-[inset_0_0_0_1px_var(--color-field-border-hover)]',
                        TOGGLE_BUTTON
                      )}
                      data-testid={`skip-encounter-${index}`}
                      onClick={isSkipped ? (e) => onDeleteSkip(e, index) : (e) => onSkip(e, index)}
                      size="icon"
                      variant="basic"
                    >
                      {isSkipped ? (
                        <EyeOffIcon className={ROW_ICON} />
                      ) : (
                        <EyeIcon className={ROW_ICON} />
                      )}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      {open === 'NOTES' && (
        <div className={PANEL}>
          <div className={PANEL_HEADER}>
            <div className={PANEL_TITLE}>
              <p>{t('notes')}</p>
              <Button
                aria-label="close-scroll-list"
                className={CLOSE}
                data-testid="close-scroll-list"
                onClick={() => setOpen(null)}
                size="icon"
                variant="basic"
              >
                <XIcon className={ROW_ICON} />
              </Button>
            </div>
          </div>
          <textarea
            className="flex-1"
            data-testid="game-notes"
            onChange={(e) => changeNotes(e.target.value)}
            value={notes[selectedGame?.value] ?? ''}
          />
        </div>
      )}
      {selectedGame?.value ? (
        <div className="flex items-center gap-(--spacing-2)">
          <Button
            aria-label="open-notes"
            aria-pressed={open === 'NOTES'}
            className={PANEL_TOGGLE}
            data-testid="open-notes"
            onClick={toggleNotes}
            size="compact-icon"
            title="Open notes"
            type="button"
          >
            <PencilIcon className={ROW_ICON} />
          </Button>
          <Button
            aria-label="open-scroll-list"
            aria-pressed={open === 'SCROLL_LIST'}
            className={PANEL_TOGGLE}
            data-testid="open-scroll-list"
            onClick={toggleScrollList}
            size="compact-icon"
            type="button"
          >
            <SquareMenu className={ROW_ICON} strokeWidth={2.5} />
          </Button>
          {lastEncounter > -1 && (
            <button
              aria-label="scroll-to-last-encounter"
              className="w-fit cursor-pointer rounded-[4px] border-none px-[6px] pb-px md:pt-[2px] bg-transparent font-[sans-serif] leading-[1.15] text-start text-(length:--font-size-7)! text-foreground hover:underline max-md:py-0 max-md:pr-0 max-md:pl-(--spacing-1) max-md:text-(length:--font-size-3)!"
              data-testid={`scroll-to-last-encounter-${lastEncounter}`}
              onClick={() => scrollTo(lastEncounter)}
              type="button"
            >
              {t('go_to')} {encounters[lastEncounter]?.location}{' '}
              <ArrowRightIcon
                aria-hidden
                className="mr-[0.25rem] inline-block h-[1em] w-[1.18em] align-top md:-mt-px"
              />
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}

export default ScrollList;
