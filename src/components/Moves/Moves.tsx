import React, { useCallback } from 'react';
import { Move } from 'components';
import { PHYS_SPEC_SPLIT } from 'constants/constant';
import MOVES from 'constants/moves';
import useStore from 'store';
import styles from './Moves.module.scss';

interface MovesProps {
  moves?: number[];
}

function Moves({ moves = [] }: MovesProps): JSX.Element {
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const isSplit = !PHYS_SPEC_SPLIT.includes(selectedGame?.value);
  return (
    <div className={styles.moves}>
      {moves?.map((move, i) => {
        const moveDetail = MOVES.find((item) => item.id === move);
        return (
          !!moveDetail && (
            <Move key={`move-${move}-${i + 1}`} moveDetail={moveDetail} showStatus={isSplit} />
          )
        );
      })}
    </div>
  );
}

export default Moves;
