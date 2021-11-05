import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';
import styles from './Badges.module.scss';

function Badges(): JSX.Element {
  const navigate = useNavigate();
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const selectBadge = useStore(useCallback((state) => state.selectBadge, []));
  const handleClick = (badgeIndex: number) => {
    selectBadge(badgeIndex);
  };

  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/badgedetail/${selectedGame?.value}/${index}`);
  };

  return (
    <div className={styles.badges} data-testid="badges">
      {!!selectedGame &&
        badges[selectedGame?.value]?.map((badge, index) => {
          return (
            <button
              className={`${styles.badge} ${
                index <= games[selectedGame?.value]?.badge ? styles.active : ''
              }`}
              key={`${badge.name}-${badge.id}`}
              onClick={() => handleClick(index)}
              title={badge.name}
              type="button"
            >
              <img src={badge.src} alt={badge.name} />
              <span className={styles.levelCap}>{badge.levelCap}</span>
              <div
                className={styles.question}
                data-testid={`badge-detail-${index}`}
                onClick={(e) => handleOpen(e, index)}
                role="presentation"
              >
                <Icon name="question" />
              </div>
            </button>
          );
        })}
    </div>
  );
}

export default Badges;
