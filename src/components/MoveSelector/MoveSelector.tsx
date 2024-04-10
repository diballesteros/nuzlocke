import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { Filter, Move } from 'components';
import { PHYS_SPEC_SPLIT } from 'constants/constant';
import MOVES, { MOVEMAP } from 'constants/moves';
import useFilter from 'hooks/useFilter';
import useRemtoPx from 'hooks/useRemToPx';
import useStore from 'store';
import styles from './MoveSelector.module.scss';

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

  const renderRow: React.FC<RowProps> = ({ index, style }) => {
    const move = filteredMoves[index];
    return (
      <div style={style}>
        <div
          className={styles.row}
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
    <Modal
      open={open}
      trigger={
        currentMoveId ? (
          <div onClick={() => setOpen(true)} role="presentation" className={styles.currentMove}>
            <Move moveDetail={currentMove} showStatus={isSplit} />
            <Button
              basic
              className={styles.trash}
              compact
              icon="trash"
              name="trash"
              onClick={handleClear}
            />
          </div>
        ) : (
          <div className={styles.selector} onClick={() => setOpen(true)} role="presentation">
            <b>{t('select_move')}</b> <Icon name="hand pointer outline" />
          </div>
        )
      }
    >
      <Modal.Content className={styles.content} scrolling>
        <div data-testid="move-selector-wrapper">
          <Filter hideGen={hideGen} values={values} />
        </div>
        {/* @ts-ignore */}
        <FixedSizeList
          height={400}
          itemCount={filteredMoves.length}
          itemSize={itemSize}
          width="100%"
        >
          {renderRow}
        </FixedSizeList>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default MoveSelector;
