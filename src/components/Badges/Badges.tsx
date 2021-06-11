import React from 'react';
import BADGES from 'constants/badges';
import { TBadge } from 'constants/types';
import styles from './Badges.module.scss';

const Badges: React.FC = () => {
  const handleClick = (value: TBadge) => {};

  return (
    <div className={styles.badges}>
      {BADGES['1'].map((badge) => {
        return (
          <div
            className={styles.badge}
            key={`${badge.name}-${badge.id}`}
            onClick={() => handleClick(badge)}
            role="presentation"
            title={badge.name}
          >
            <img src={badge.src} alt={badge.name} />
            <span className={styles.levelCap}>{badge.levelCap}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Badges;
