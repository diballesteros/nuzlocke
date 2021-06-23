import React from 'react';
import useStore from 'store';
import BADGES from 'constants/badges';
import styles from './Badges.module.scss';

const Badges: React.FC = () => {
  const appState = useStore((state) => state);
  const handleClick = (badgeIndex: number) => {
    appState.selectBadge(badgeIndex);
  };

  return (
    <div className={styles.badges}>
      {!!appState.selectedGame ? (
        BADGES[appState.selectedGame?.id]?.map((badge, index) => {
          return (
            <button
              className={`${styles.badge} ${
                index <= appState.games[appState.selectedGame?.id]?.badge ? styles.active : ''
              }`}
              key={`${badge.name}-${badge.id}`}
              onClick={() => handleClick(index)}
              title={badge.name}
              type="button"
            >
              <img src={badge.src} alt={badge.name} />
              <span className={styles.levelCap}>{badge.levelCap}</span>
            </button>
          );
        })
      ) : (
        <div className={styles.suggestion}>Select a Game</div>
      )}
    </div>
  );
};

export default Badges;
