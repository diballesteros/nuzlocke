import React, { useCallback } from 'react';
import { CATEGORY_COLOR, TYPE_COLOR } from 'constants/colors';
import MOVES from 'constants/moves';
import { PHYS_SPEC_SPLIT } from 'constants/constant';
import useStore from 'store';
import styles from './Moves.module.scss';

interface MovesProps {
  moves?: number[];
}

const Moves: React.FC<MovesProps> = ({ moves = [] }) => {
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const isSplit = PHYS_SPEC_SPLIT.includes(selectedGame?.value);
  return (
    <div className={styles.moves}>
      {moves?.map((move, i) => {
        const moveDetail = MOVES.find((item) => item.id === move);
        return (
          !!moveDetail && (
            <div className={styles.move} key={`move-${move}-${i + 1}`}>
              <span>{moveDetail.name}</span>
              <div className={`${styles.moveCategorization} ${isSplit ? styles.split : ''}`}>
                <span
                  className={styles.moveType}
                  style={{ backgroundColor: TYPE_COLOR[moveDetail.type] }}
                >
                  {moveDetail.type}
                </span>
                {isSplit && (
                  <span
                    className={styles.moveCategory}
                    style={{ backgroundColor: CATEGORY_COLOR[moveDetail.category] }}
                  >
                    {moveDetail.category}
                  </span>
                )}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default Moves;
