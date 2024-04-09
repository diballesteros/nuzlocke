import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { BADGE_IMAGES } from 'constants/badges';
import useStore from 'store';
import styles from './Badges.module.scss';

function Badges(): React.JSX.Element {
  const navigate = useNavigate();
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const customBadges = useStore(useCallback((state) => state.customBadges, []));
  const selectBadge = useStore(useCallback((state) => state.selectBadge, []));
  const handleClick = (badgeIndex: number) => {
    selectBadge(badgeIndex);
  };

  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/badgedetail/${selectedGame?.value}/${index}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(`/badgedetail/${selectedGame?.value}/${index}`);
    }
  };

  return (
    <div className={styles.badges} data-testid="badges">
      {!!selectedGame &&
        badges[selectedGame?.value]?.map((badge, index) => {
          const badgeArr = games[selectedGame?.value]?.badge;
          return (
            <button
              className={`${styles.badge} ${
                Array.isArray(badgeArr) && badgeArr?.includes(index) ? styles.active : ''
              }`}
              key={`${badge.name}-${badge.id}`}
              onClick={() => handleClick(index)}
              title={badge.name}
              type="button"
            >
              <img src={BADGE_IMAGES[selectedGame?.value][index].src} alt={badge.name} />
              <span className={styles.levelCap}>{badge.levelCap}</span>
              <div
                className={styles.question}
                data-testid={`badge-detail-${index}`}
                onClick={(e) => handleOpen(e, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                role="button"
                tabIndex={0}
              >
                <Icon name="question" />
              </div>
            </button>
          );
        })}
      {!!selectedGame &&
        customBadges[selectedGame?.value] &&
        customBadges[selectedGame?.value]?.map((badge, index) => {
          const badgeArr = games[selectedGame?.value]?.badge;
          return (
            <button
              className={`${styles.badge} ${
                Array.isArray(badgeArr) && badgeArr?.includes(index) ? styles.active : ''
              }`}
              key={`${badge}-${Number(index) + 1}`}
              onClick={() => handleClick(index)}
              type="button"
            >
              <span className={styles.customBadge}>{badge}</span>
            </button>
          );
        })}
    </div>
  );
}

export default Badges;
