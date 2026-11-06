import { Pointer } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, RowComponentProps as RowProps } from 'react-window';
import { Filter, Move } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import { PHYS_SPEC_SPLIT } from 'constants/constant';
import MOVES, { MOVEMAP } from 'constants/moves';
import useFilter from 'hooks/useFilter';
import useRemtoPx from 'hooks/useRemToPx';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { BUTTON_ICON, TrashIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface MoveSelectorProps {
  currentMoveId: number;
  handleMove: (moveId: number) => void;
  hideGen?: boolean;
  limitGen?: number;
  // `tile`: the encounter editor's look (5m): a 40px field with the move's type as a stripe, a
  // button that opens the list, and the delete button at its end
  look?: 'tile';
  // The tile's slot ("Move 1"), read before its move so the four tiles can be told apart
  slot?: string;
}

// The tile's focus ring and hover, as the tracker rows' controls
const TILE =
  'relative flex h-[2.857rem] min-w-0 cursor-pointer items-center gap-(--spacing-2) rounded-md border border-solid border-contrast-border bg-transparent py-0 pr-(--spacing-1) pl-(--spacing-1) text-foreground has-[>button:first-of-type:focus-visible]:outline-2 has-[>button:first-of-type:focus-visible]:outline-offset-2 has-[>button:first-of-type:focus-visible]:outline-row-ring hover:border-foreground';

function MoveSelector({
  currentMoveId,
  handleMove,
  hideGen,
  limitGen,
  look,
  slot,
}: MoveSelectorProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const values = useFilter();
  const itemSize = useRemtoPx(2.857);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const isSplit = !PHYS_SPEC_SPLIT.includes(selectedGame?.value);
  const currentMove = MOVEMAP.get(currentMoveId);
  const filteredMoves = MOVES.filter(
    (m) =>
      m.name.toUpperCase().includes(values.search) &&
      (values.gens.length > 0 ? values.gens.includes(m.gen) : true) &&
      (limitGen ? m.gen <= limitGen : true) &&
      (values.types.length > 0 ? values.types.includes(m.type) : true)
  );

  const handleClick = (moveId: number) => {
    handleMove(moveId);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    handleMove(null);
  };

  const renderRow = ({ ariaAttributes, index, style }: RowProps) => {
    const move = filteredMoves[index];
    return (
      <div style={style} {...ariaAttributes}>
        <div
          className="pr-(--spacing-3)"
          data-testid={`move-${move.name}`}
          onClick={() => handleClick(move.id)}
          role="presentation"
        >
          <Move moveDetail={move} showStatus={isSplit} />
        </div>
      </div>
    );
  };

  const tile = (
    // The tile opens the list on a click anywhere (specs click it), its button on Enter or Space
    <div className={TILE} onClick={() => setOpen(true)} role="presentation">
      <span
        aria-hidden
        className="my-(--spacing-1) w-[6px] self-stretch rounded-[3px] bg-contrast-border"
        style={currentMove ? { background: TYPE_COLOR[currentMove.type] } : undefined}
      />
      <button
        className="flex h-full min-w-0 flex-1 cursor-pointer items-center border-0 bg-transparent p-0 text-left text-(length:--font-size-2) leading-none outline-none"
        title={currentMove?.type}
        type="button"
      >
        {slot && <span className="sr-only">{slot}: </span>}
        {currentMove ? (
          <span className="truncate font-bold">
            {currentMove.name}
            <span className="sr-only">, {currentMove.type}</span>
          </span>
        ) : (
          <span className="truncate text-row-muted">{t('select_move')}</span>
        )}
      </button>
      {currentMove && (
        <Button
          aria-label={t('delete_move', { move: currentMove.name })}
          className="size-[2.286rem] p-0 text-row-muted hover:text-foreground"
          name="trash"
          onClick={handleClear}
          size="icon"
          variant="basic-plain"
        >
          <TrashIcon className={cn('trash', BUTTON_ICON)} />
        </Button>
      )}
    </div>
  );

  return (
    <>
      {look === 'tile' ? (
        tile
      ) : currentMoveId ? (
        <div className="relative" onClick={() => setOpen(true)} role="presentation">
          <Move moveDetail={currentMove} showStatus={isSplit} />
          {/* Semantic's `basic compact icon` button, its padding cut to --spacing-1 */}
          <Button
            aria-label="trash"
            className="absolute top-(--spacing-1) right-(--spacing-1) p-(--spacing-1)"
            name="trash"
            onClick={handleClear}
            size="icon"
            variant="basic-plain"
          >
            {/* `trash` was the Semantic icon's class, which specs still find */}
            <TrashIcon className={cn('trash', BUTTON_ICON)} />
          </Button>
        </div>
      ) : (
        <div
          className="flex h-[2.143rem] max-h-[2.143rem] cursor-pointer flex-row flex-nowrap items-center justify-center rounded-[4px] border border-dashed border-foreground bg-card p-(--spacing-1) text-(length:--font-size-3) text-foreground"
          onClick={() => setOpen(true)}
          role="presentation"
        >
          <b>{t('select_move')}</b>{' '}
          {/* FontAwesome's `hand pointer outline`, in Semantic's 1em × 1.18em icon slot */}
          <Pointer aria-hidden className="mr-[0.25rem] h-[1em] w-[1.18em]" strokeWidth={2} />
        </div>
      )}
      <Dialog open={open}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('move_list')}</DialogTitle>
          <DialogBody scrolling>
            <div className="mb-(--spacing-3)" data-testid="move-selector-wrapper">
              <Filter hideGen={hideGen} values={values} />
            </div>
            <List
              rowComponent={renderRow}
              rowCount={filteredMoves.length}
              rowHeight={itemSize}
              rowProps={{}}
              style={{ height: 400, width: '100%' }}
            />
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="secondary">
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MoveSelector;
