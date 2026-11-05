import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NICKNAMES from 'constants/nicknames';
import useStore from 'store';
import { ShuffleIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { ROW_GHOST, TALL } from '../buttons';

interface NicknameProps {
  className?: string;
  encounterId: number;
  nickname?: string;
  // 40px tall on phones
  tall?: boolean;
}

// The nickname field with its Randomize button beside it, at the row's control height
function Nickname({
  className,
  encounterId,
  nickname,
  tall = false,
}: NicknameProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const changeNickname = useStore((state) => state.changeNickname);
  const [nick, setNick] = useState(nickname ?? '');
  // The field follows the stored nickname when it changes elsewhere (Randomize, an import)
  const [stored, setStored] = useState(nickname);
  if (nickname !== stored) {
    setStored(nickname);
    setNick(nickname ?? '');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNick(e.target.value);
  };

  const handleBlur = () => {
    changeNickname(encounterId, nick);
  };

  const handleRandomize = () => {
    changeNickname(encounterId, NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)]);
  };

  return (
    <div
      className={cn('flex min-w-0 items-center gap-(--spacing-1)', className)}
      data-testid={`nickname-${encounterId}`}
    >
      <input
        aria-label={t('nickname')}
        className={cn(
          'm-0! h-[1.857rem] w-0 min-w-0 flex-1 rounded-md border border-solid border-contrast-border bg-transparent px-(--spacing-2) font-[inherit]! text-(length:--font-size-2)! leading-none! text-foreground outline-none placeholder:text-row-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring',
          tall && TALL
        )}
        id={`nickname-${encounterId}`}
        maxLength={12}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={`${t('nickname')}...`}
        value={nick}
      />
      {/* The `ui` class keeps the specs' `nickname-… > .ui` locator */}
      <button
        aria-label={t('randomize')}
        className={cn('ui', ROW_GHOST, tall ? 'size-[2.857rem]' : 'size-[1.857rem]')}
        onClick={handleRandomize}
        title={t('randomize')}
        type="button"
      >
        <ShuffleIcon aria-hidden />
      </button>
    </div>
  );
}

export default Nickname;
