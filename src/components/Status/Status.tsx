import {
  Ambulance,
  ArrowLeftRight,
  Ban,
  ChevronDown,
  Crown,
  Gem,
  Gift,
  type LucideIcon,
  Package,
} from 'lucide-react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import STATUSES from 'constants/status';
import type { TEncounter } from 'constants/types';
import useStore from 'store';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Statuses name their FontAwesome icon (custom ones too, from older versions); these are the lucide
// glyphs for them. An unknown name keeps Semantic's empty icon slot.
const ICONS: Record<string, LucideIcon> = {
  'ambulance': Ambulance,
  'ban': Ban,
  'box': Package,
  'chess king': Crown,
  'diamond': Gem,
  'exchange': ArrowLeftRight,
  'gift': Gift,
};

// Semantic's 1em × 1.18em icon slot before an option's text. The item's text is translucent, so the
// glyph is drawn opaque and faded as a whole: its paths would otherwise paint darker where they cross
const ICON =
  'mr-[0.78571429em] inline-block h-[1em] w-[1.18em] align-top text-black opacity-87 group-data-highlighted/item:opacity-95 group-data-[state=checked]/item:opacity-95';

// The row's status dot, so a column of statuses scans at a glance (custom statuses get a neutral one)
const DOT: Record<number, string> = {
  1: 'bg-green',
  2: 'bg-destructive',
  3: 'bg-violet-500',
  4: 'bg-orange-500',
  5: 'bg-grey',
  7: 'bg-primary',
};

function StatusIcon({ name }: { name?: string }) {
  const Glyph = ICONS[name];
  return Glyph ? (
    <Glyph aria-hidden className={ICON} strokeWidth={2.5} />
  ) : (
    <span aria-hidden className={ICON} />
  );
}

const Status = React.memo(function Status({ encounter, triggerClassName }: StatusProps) {
  const { t } = useTranslation('common');
  const changeStatus = useStore(useCallback((state) => state.changeStatus, []));
  const customStatuses = useStore(useCallback((state) => state.customStatuses, []));
  const allStatuses = STATUSES.concat(customStatuses);
  const handleChange = (value: string) => {
    const foundStatus = allStatuses.find((stat) => String(stat.value) === value);
    changeStatus(encounter.id, foundStatus);
  };

  return (
    <Select
      aria-label={t('status')}
      data-testid={`status-${encounter.id}`}
      disabled={!encounter?.pokemon}
      icon={<ChevronDown aria-hidden className="size-[1.143rem] shrink-0" strokeWidth={2.5} />}
      leading={
        encounter?.status ? (
          <span
            aria-hidden
            className={cn(
              'size-[0.571rem] shrink-0 rounded-full',
              DOT[encounter.status.value] ?? 'bg-contrast-border'
            )}
          />
        ) : undefined
      }
      look="row"
      // Semantic's `basic labeled` menu: 2px below the field, with a rule above its first item too
      menuClassName="[&_[role=option]:first-child]:border-t"
      menuOffset={2}
      onChange={handleChange}
      options={allStatuses.map((status) => ({
        icon: <StatusIcon name={status.icon} />,
        text: status.text,
        value: String(status.value),
      }))}
      placeholder={`${t('status')}...`}
      triggerClassName={triggerClassName}
      value={encounter?.status?.value != null ? String(encounter.status.value) : ''}
    />
  );
});

interface StatusProps {
  encounter: TEncounter;
  triggerClassName?: string;
}

export default Status;
