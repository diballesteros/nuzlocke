import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NICKNAMES from 'constants/nicknames';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { BUTTON_ICON, ShuffleIcon } from '@/components/ui/icons';

interface NicknameProps {
  encounterId: number;
  nickname?: string;
}

// Semantic's `fluid action` Input: a transparent field in the page's colours with the randomize
// button attached on its right. Semantic's reset styles every <input> and <button>, so their font,
// size, line height and margin are marked important (!)
function Nickname({ encounterId, nickname }: NicknameProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const changeNickname = useStore((state) => state.changeNickname);
  const [nick, setNick] = useState(nickname ?? '');

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
      className="relative col-span-2 flex w-full text-[1rem] text-field-foreground"
      data-testid={`nickname-${encounterId}`}
    >
      <input
        aria-label="nickname"
        className="m-0! w-0 max-w-full flex-[1_0_auto] appearance-none rounded-l-[0.28571429rem] rounded-r-none border border-solid border-contrast-border bg-transparent px-[1em] py-[0.67857143em] text-left font-control! text-[1em]! leading-[1.21428571em]! text-foreground outline-none transition-[box-shadow,border-color] duration-100 placeholder:text-placeholder"
        id={`nickname-${encounterId}`}
        maxLength={12}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={`${t('nickname')}...`}
        value={nick}
      />
      {/* The `ui` class keeps the specs' `nickname-… > .ui` locator */}
      <Button
        aria-label="randomize"
        className="ui mr-0! rounded-l-none rounded-r-[0.28571429rem] max-sm:p-(--spacing-2)"
        onClick={handleRandomize}
        size="icon"
        title="Randomize"
        type="button"
      >
        <ShuffleIcon className={BUTTON_ICON} />
      </Button>
    </div>
  );
}

export default Nickname;
