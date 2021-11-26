import { ReactText, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import { Page } from 'common';
import { BadgeDetail } from 'components/Badges/elements';
import DETAILS from 'constants/details';
import useStore from 'store';
import styles from './BadgePage.module.scss';

function BadgePage(): JSX.Element {
  const navigate = useNavigate();
  const { badge, game } = useParams();
  const { t } = useTranslation('badges');
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const [tab, setTab] = useState(0);

  const selectedDetail =
    !!game && DETAILS[game] && !!badge && typeof Number(badge) === 'number'
      ? DETAILS[game][Number(badge)]
      : null;

  useEffect(() => {
    if (selectedGame?.value !== game) {
      navigate('/');
    }
  }, [game, navigate, selectedGame]);

  useEffect(() => {
    if (!selectedDetail) {
      navigate('/');
    }
  }, [game, navigate, selectedDetail]);

  const panes = selectedDetail
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
    <Page header={t('details')}>
      <Tab
        activeIndex={tab}
        className={styles.tabs}
        data-testid="badge-details-tabs"
        menu={{ attached: false, tabular: false }}
        onTabChange={(e, data) => handleTabChange(data.activeIndex)}
        panes={panes}
      />
    </Page>
  );
}

export default BadgePage;
