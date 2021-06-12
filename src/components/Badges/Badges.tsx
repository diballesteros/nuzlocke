import React, { useState } from 'react';
import BADGES from 'constants/badges';
import styles from './Badges.module.scss';

const Badges: React.FC = () => {
  const [number, setNumber] = useState(-1);
  const handleClick = (i: number) => {
    if (i === number) {
      setNumber((prev) => prev - 1);
    } else {
      setNumber(i);
    }
  };

  return (
    <div className={styles.badges}>
      {BADGES['1'].map((badge, index) => {
        return (
          <button
            className={`${styles.badge} ${index <= number ? styles.active : ''}`}
            key={`${badge.name}-${badge.id}`}
            onClick={() => handleClick(index)}
            title={badge.name}
            type="button"
          >
            <img src={badge.src} alt={badge.name} />
            <span className={styles.levelCap}>{badge.levelCap}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Badges;
