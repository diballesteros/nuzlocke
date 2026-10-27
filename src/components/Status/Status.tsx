import {
  Ambulance,
  ArrowLeftRight,
  Ban,
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

function StatusIcon({ name }: { name?: string }) {
  const Glyph = ICONS[name];
  return Glyph ? (
    <Glyph aria-hidden className={ICON} strokeWidth={2.5} />
  ) : (
    <span aria-hidden className={ICON} />
  );
}

const Status = React.memo(function Status({ encounter }: StatusProps) {
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
      aria-label="status-selector"
      caret="font"
      // Semantic drew this caret 0.48px further right than the Calculator's
      caretShift={0.48}
      className="block w-full min-w-0"
      contained
      data-testid={`status-${encounter.id}`}
      disabled={!encounter?.pokemon}
      look="contrast"
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
      triggerClassName="min-w-0"
      value={encounter?.status?.value != null ? String(encounter.status.value) : ''}
    />
  );
});

interface StatusProps {
  encounter: TEncounter;
}

export default Status;
