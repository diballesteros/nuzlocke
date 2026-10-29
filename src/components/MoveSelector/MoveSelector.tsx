import { Pointer } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, RowComponentProps as RowProps } from 'react-window';
import { Filter, Move } from 'components';
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
}

function MoveSelector({
  currentMoveId,
  handleMove,
  hideGen,
  limitGen,
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

  return (
    <>
      {currentMoveId ? (
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
