import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { EncounterSelector } from 'common';
import STATUSES from 'constants/status';
import type { TEncounter } from 'constants/types';
import { selectTeam } from 'selectors';
import useStore from 'store';
import styles from './Swap.module.scss';

interface SwapProps {
  encounter: TEncounter;
}

function Swap({ encounter }: SwapProps): JSX.Element {
  const { t } = useTranslation('tracker');
  const changeStatus = useStore(useCallback((state) => state.changeStatus, []));
  const team = useStore(selectTeam);

  const text = encounter?.status?.value !== 7 ? t('Team', { ns: 'stats' }) : t('Box');

  const handleSwap = () => {
    if (encounter?.status?.value === 7) {
      const foundStatus = STATUSES.find((stat) => stat.value === 1);
      changeStatus(encounter.id, foundStatus);
    } else if (team?.length < 6) {
      const foundStatus = STATUSES.find((stat) => stat.value === 7);
      changeStatus(encounter.id, foundStatus);
    }
  };

  const handleTeamSwap = (encounterSwap: TEncounter) => {
    const foundTeamStatus = STATUSES.find((stat) => stat.value === 7);
    const foundCaughtStatus = STATUSES.find((stat) => stat.value === 1);
    changeStatus(encounterSwap?.id, foundCaughtStatus);
    changeStatus(encounter?.id, foundTeamStatus);
  };

  return encounter?.status?.value !== 7 && team?.length > 5 ? (
    <EncounterSelector encounters={team} handleEncounter={handleTeamSwap}>
      <Button
        aria-label="swap"
        className={styles.button}
        data-testid={`swap-${encounter.id}`}
        title={text}
        type="button"
      >
        {text}
        <Icon name="chess king" />
      </Button>
    </EncounterSelector>
  ) : (
    <Button
      aria-label="swap"
      className={styles.button}
      data-testid={`swap-${encounter.id}`}
      onClick={handleSwap}
      title={text}
      type="button"
    >
      {text}
      <Icon name={encounter?.status?.value === 7 ? 'computer' : 'chess king'} />
    </Button>
  );
}

export default Swap;
