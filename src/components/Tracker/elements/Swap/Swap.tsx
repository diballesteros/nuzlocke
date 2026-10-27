import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Monitor } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { EncounterSelector } from 'common';
import STATUSES from 'constants/status';
import type { TEncounter } from 'constants/types';
import { selectTeam } from 'selectors';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { TRAILING_ICON } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { OUTLINE_BUTTON } from '../buttons';

// The icon sits --spacing-2 after the text and hides on the narrowest screens
const ICON = cn(
  TRAILING_ICON,
  'mr-[0.011em] ml-[calc(var(--spacing-2)+0.01em)] max-xs:[display:none]!'
);

interface SwapProps {
  encounter: TEncounter;
}

function Swap({ encounter }: SwapProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const changeStatus = useStore(useCallback((state) => state.changeStatus, []));
  const changePreviousStatus = useStore(useCallback((state) => state.changePreviousStatus, []));
  const team = useStore(useShallow(selectTeam));

  const text = encounter?.status?.value !== 7 ? t('Team', { ns: 'stats' }) : t('Box');

  const handleSwap = () => {
    if (encounter?.status?.value === 7) {
      const caughtStatus = encounter?.previousStatus
        ? encounter.previousStatus
        : STATUSES.find((stat) => stat.value === 1);
      changeStatus(encounter.id, caughtStatus);
    } else if (team?.length < 6) {
      const foundStatus = STATUSES.find((stat) => stat.value === 7);
      changePreviousStatus(encounter.id, encounter.status);
      changeStatus(encounter.id, foundStatus);
    }
  };

  const handleTeamSwap = (encounterSwap: TEncounter) => {
    const foundTeamStatus = STATUSES.find((stat) => stat.value === 7);
    const foundCaughtStatus = encounter?.previousStatus
      ? encounter.previousStatus
      : STATUSES.find((stat) => stat.value === 1);
    changeStatus(encounterSwap?.id, foundCaughtStatus);
    changePreviousStatus(encounter.id, encounter.status);
    changeStatus(encounter?.id, foundTeamStatus);
  };

  return encounter?.status?.value !== 7 && team?.length > 5 ? (
    <EncounterSelector encounters={team} handleEncounter={handleTeamSwap}>
      <Button
        aria-label="swap"
        className={OUTLINE_BUTTON}
        data-testid={`swap-${encounter.id}`}
        title={text}
        type="button"
        variant="secondary"
      >
        {text}
        <Crown className={ICON} strokeWidth={2.5} />
      </Button>
    </EncounterSelector>
  ) : (
    <Button
      aria-label="swap"
      className={OUTLINE_BUTTON}
      data-testid={`swap-${encounter.id}`}
      onClick={handleSwap}
      title={text}
      type="button"
      variant="secondary"
    >
      {text}
      {encounter?.status?.value === 7 ? (
        <Monitor className={ICON} strokeWidth={2.5} />
      ) : (
        <Crown className={ICON} strokeWidth={2.5} />
      )}
    </Button>
  );
}

export default Swap;
