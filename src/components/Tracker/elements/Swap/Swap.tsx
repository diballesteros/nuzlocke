import { useCallback } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { EncounterSelector } from 'common';
import STATUSES from 'constants/status';
import type { TEncounter } from 'constants/types';
import { selectCaught, selectTeam } from 'selectors';
import useStore from 'store';
import styles from './Swap.module.scss';

interface SwapProps {
  encounter: TEncounter;
}

function Swap({ encounter }: SwapProps): JSX.Element {
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const changeStatus = useStore(useCallback((state) => state.changeStatus, []));
  const team = useStore(selectTeam);
  const caught = useStore(selectCaught);

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
    <EncounterSelector encounters={caught} handleEncounter={handleTeamSwap}>
      <Button
        aria-label="swap"
        className={styles.button}
        data-testid={`swap-${encounter.id}`}
        icon="chess king"
        inverted={darkMode}
        title={`Swap to ${encounter?.status?.value !== 7 ? 'Team' : 'Box'}`}
        type="button"
      />
    </EncounterSelector>
  ) : (
    <Button
      aria-label="swap"
      className={styles.button}
      data-testid={`swap-${encounter.id}`}
      icon={encounter?.status?.value === 7 ? 'computer' : 'chess king'}
      inverted={darkMode}
      onClick={handleSwap}
      title={`Swap to ${encounter?.status?.value !== 7 ? 'Team' : 'Box'}`}
      type="button"
    />
  );
}

export default Swap;
