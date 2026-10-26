import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'common';
import { BadgeDetail } from 'components/Badges/elements';
import DETAILS from 'constants/details';
import useStore from 'store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function BadgePage(): React.JSX.Element {
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

  return (
    <Page header={t('details')}>
      {selectedDetail && (
        <Tabs
          className="flex min-h-0 flex-1 flex-col flex-nowrap"
          data-testid="badge-details-tabs"
          onValueChange={(value) => setTab(Number(value))}
          value={String(tab)}
          variant="menu"
        >
          <TabsList>
            {selectedDetail.map((gameDetail, i) => (
              <TabsTrigger key={gameDetail.game} value={String(i)}>
                {gameDetail.game}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* One panel for whichever tab is active, as Semantic rendered it, so the Original/Rematch
              choice carries over to the next game */}
          <TabsContent
            className="flex min-h-0 flex-1 flex-col flex-nowrap gap-(--spacing-3) p-(--spacing-1)"
            value={String(tab)}
          >
            <BadgeDetail selectedDetail={selectedDetail[tab]} />
          </TabsContent>
        </Tabs>
      )}
    </Page>
  );
}

export default BadgePage;
