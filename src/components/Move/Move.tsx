import React from 'react';
import { Type } from 'components';
import { CATEGORY_COLOR, TYPE_COLOR } from 'constants/colors';
import { TMove } from 'constants/types';
import styles from './Move.module.scss';

interface MoveProps {
  moveDetail: TMove;
  showStatus: boolean;
}

const Move: React.FC<MoveProps> = ({ moveDetail, showStatus }) => {
  return (
    <div className={styles.move} style={{ backgroundColor: `${TYPE_COLOR[moveDetail.type]}90` }}>
      <Type hideName type={moveDetail.type} />
      <span>{moveDetail.name}</span>
      {showStatus && (
        <img
          alt="move status"
          src={CATEGORY_COLOR[moveDetail.category]}
          title={moveDetail.category}
        />
      )}
    </div>
  );
};

export default Move;
