import React, { useContext } from 'react';
import BADGES from 'constants/badges';
import AppContext from 'context/AppContext';
import styles from './Badges.module.scss';

const Badges: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const handleClick = (badgeIndex: number) => {
    dispatch({ type: 'SELECT_BADGE', payload: { badgeIndex } });
  };

  return (
    <div className={styles.badges}>
      {!!state.selectedGame ? (
        BADGES[state.selectedGame?.id]?.map((badge, index) => {
          return (
            <button
              className={`${styles.badge} ${
                index <= state.games[state.selectedGame?.id]?.badge ? styles.active : ''
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
