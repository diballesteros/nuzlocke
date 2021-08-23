import React, { ReactText, useCallback, useState } from 'react';
import useStore from 'store';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import DETAILS from 'constants/details';
import { BadgeDetail } from 'components';
import styles from './Badges.module.scss';

const Badges: React.FC = () => {
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const selectBadge = useStore(useCallback((state) => state.selectBadge, []));
  const handleClick = (badgeIndex: number) => {
    selectBadge(badgeIndex);
  };
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(0);
  const [tab, setTab] = useState(0);

  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    setDetail(index);
  };
  const selectedDetail =
    !!selectedGame && typeof detail === 'number' && DETAILS[selectedGame?.value]
      ? DETAILS[selectedGame?.value][detail]
      : null;

  const handleTabChange = (newIndex: ReactText) => {
    setTab(Number(newIndex));
  };

  const handleClose = () => {
    setOpen(false);
    setDetail(0);
    setTab(0);
  };

  const panes = !!selectedDetail
    ? selectedDetail.map((game) => {
        return {
          menuItem: game.game,
          render: () => (
            <Tab.Pane>
              <BadgeDetail selectedDetail={selectedDetail[tab]} />
            </Tab.Pane>
          ),
        };
      })
    : null;

  return (
    <div className={styles.badges}>
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
      <Modal closeOnDimmerClick onClose={handleClose} open={open}>
        <Modal.Header>Details</Modal.Header>
        <Modal.Content
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            maxHeight: '70vh',
            gap: '5px',
            overflow: 'auto',
          }}
        >
          <Tab
            activeIndex={tab}
            className={styles.tabs}
            menu={{ attached: false, tabular: false }}
            onTabChange={(e, data) => handleTabChange(data.activeIndex)}
            panes={panes}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Badges;
