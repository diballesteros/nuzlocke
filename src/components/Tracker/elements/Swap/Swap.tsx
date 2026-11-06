import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Monitor } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { EncounterSelector } from 'common';
import STATUSES from 'constants/status';
import type { TEncounter } from 'constants/types';
import { selectTeam } from 'selectors';
import useStore from 'store';
import { cn } from '@/lib/utils';
import { ROW_CONTROL, ROW_ICON_CONTROL } from '../buttons';

// The statuses that can move to the team and back (Captured, Shiny, Gifted, Team)
export const SWAPPABLE = [1, 3, 4, 7];

// Moving an encounter to the team or back to the box. With a full team, the move needs the team
// picker, which the button (or the row menu's item) opens
export function useSwap(encounter: TEncounter) {
  const { t } = useTranslation('tracker');
  const changeStatus = useStore(useCallback((state) => state.changeStatus, []));
  const changePreviousStatus = useStore(useCallback((state) => state.changePreviousStatus, []));
  const team = useStore(useShallow(selectTeam));
  const onTeam = encounter?.status?.value === 7;

  const swap = () => {
    if (onTeam) {
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

  const teamSwap = (encounterSwap: TEncounter) => {
    const foundTeamStatus = STATUSES.find((stat) => stat.value === 7);
    const foundCaughtStatus = encounter?.previousStatus
      ? encounter.previousStatus
      : STATUSES.find((stat) => stat.value === 1);
    changeStatus(encounterSwap?.id, foundCaughtStatus);
    changePreviousStatus(encounter.id, encounter.status);
    changeStatus(encounter?.id, foundTeamStatus);
  };

  return {
    Icon: onTeam ? Monitor : Crown,
    needsPicker: !onTeam && team?.length > 5,
    swap,
    team,
    teamSwap,
    text: onTeam ? t('Box') : t('Team', { ns: 'stats' }),
  };
}

interface SwapProps {
  className?: string;
  encounter: TEncounter;
  // Compact rows show the icon only, named by the text
  iconOnly?: boolean;
}

function Swap({ className, encounter, iconOnly = false }: SwapProps): React.JSX.Element {
  const { Icon, needsPicker, swap, team, teamSwap, text } = useSwap(encounter);

  const button = (
    <button
      aria-label={iconOnly ? text : undefined}
      className={cn(iconOnly ? ROW_ICON_CONTROL : cn(ROW_CONTROL, 'w-[6rem]'), className)}
      data-testid={`swap-${encounter.id}`}
      onClick={needsPicker ? undefined : swap}
      title={text}
      type="button"
    >
      <Icon aria-hidden strokeWidth={2.5} />
      {!iconOnly && text}
    </button>
  );

  return needsPicker ? (
    <EncounterSelector encounters={team} handleEncounter={teamSwap}>
      {button}
    </EncounterSelector>
  ) : (
    button
  );
}

export default Swap;
