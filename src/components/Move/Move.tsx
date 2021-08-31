import React from 'react';
import { CATEGORY_COLOR, TYPE_COLOR } from 'constants/colors';
import { TMove } from 'constants/types';
import { Type } from 'components';
import styles from './Move.module.scss';

interface MoveProps {
  moveDetail: TMove;
  showStatus: boolean;
}

const Move: React.FC<MoveProps> = ({ moveDetail, showStatus }) => {
  return (
    <div className={styles.move} style={{ backgroundColor: TYPE_COLOR[moveDetail.type] }}>
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
