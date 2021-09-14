import React, { ReactText, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import useStore from 'store';
import DETAILS from 'constants/details';
import { BadgeDetail } from 'components/Badges/elements';
import { Page } from 'common';
import styles from './BadgePage.module.scss';

const BadgePage: React.FC = () => {
  const history = useHistory();
  const { badge, game } = useParams<{ game: string; badge: string }>();
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const [tab, setTab] = useState(0);

  const selectedDetail =
    !!game && DETAILS[game] && !!badge && typeof Number(badge) === 'number'
      ? DETAILS[game][Number(badge)]
      : null;

  useEffect(() => {
    if (selectedGame?.value !== game) {
      history.push('/');
    }
  }, [game, history, selectedGame]);

  useEffect(() => {
    if (!selectedDetail) {
      history.push('/');
    }
  }, [game, history, selectedDetail]);

  const panes = !!selectedDetail
    ? selectedDetail.map((gameDetail) => {
        return {
          menuItem: gameDetail.game,
          render: () => (
            <Tab.Pane>
              <BadgeDetail selectedDetail={selectedDetail[tab]} />
            </Tab.Pane>
          ),
        };
      })
    : null;

  const handleTabChange = (newIndex: ReactText) => {
    setTab(Number(newIndex));
  };

  return (
    <Page header="Details">
      <Tab
        activeIndex={tab}
        className={styles.tabs}
        menu={{ attached: false, tabular: false }}
        onTabChange={(e, data) => handleTabChange(data.activeIndex)}
        panes={panes}
      />
    </Page>
  );
};

export default BadgePage;
