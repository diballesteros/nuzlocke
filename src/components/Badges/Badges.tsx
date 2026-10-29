import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { BADGE_IMAGES } from 'constants/badges';
import useStore from 'store';
import { QuestionIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// A badge: greyed out until obtained or hovered, flashing on press. Semantic's reset styles every
// <button>, so font family, size, line height and margin need !
const BADGE =
  'relative m-0! flex max-w-[8.571rem] flex-1 cursor-pointer items-center justify-center gap-(--spacing-2) h-[5.714rem] rounded-[3px] border-0 border-r border-solid border-white bg-badge p-(--spacing-3) [font-family:inherit]! text-[length:inherit]! leading-[inherit]! [font-weight:bolder] text-badge-foreground shadow-[0_0_4px_var(--color-badge-shadow)] transition-[background] duration-800 [filter:grayscale(1.1)] last:border-r-0 hover:[filter:none] active:bg-badgeflash active:transition-none';

function Badges(): React.JSX.Element {
  const { t } = useTranslation('badges');
  const navigate = useNavigate();
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const customBadges = useStore(useCallback((state) => state.customBadges, []));
  const selectBadge = useStore(useCallback((state) => state.selectBadge, []));
  const handleClick = (badgeIndex: number) => {
    selectBadge(badgeIndex);
  };

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/badgedetail/${selectedGame?.value}/${index}`);
  };

  const isActive = (index: number) => {
    const badgeArr = games[selectedGame?.value]?.badge;
    return Array.isArray(badgeArr) && badgeArr?.includes(index);
  };

  return (
    <div
      className="relative flex w-full flex-row flex-nowrap overflow-y-auto [&::-webkit-scrollbar-thumb]:h-[12px] [&::-webkit-scrollbar-thumb]:bg-[rgba(0,0,0,0.55)]!"
      data-testid="badges"
    >
      {!!selectedGame &&
        badges[selectedGame?.value]?.map((badge, index) => {
          return (
            // The badge's box holds two sibling buttons, so neither is nested in the other: the
            // toggle covers the box (:hover and :active reach the box from it), and the details
            // button sits on top in the corner
            <div
              className={cn(BADGE, isActive(index) && '[filter:none]')}
              key={`${badge.name}-${badge.id}`}
              title={badge.name}
            >
              <img
                alt=""
                className="h-[3.214rem] w-[3.214rem] object-contain"
                src={BADGE_IMAGES[selectedGame?.value][index].src}
              />
              <span className="self-end">{badge.levelCap}</span>
              <button
                aria-label={badge.name}
                aria-pressed={isActive(index)}
                className="absolute inset-0 m-0 cursor-pointer appearance-none rounded-[3px] border-0 bg-transparent p-0"
                onClick={() => handleClick(index)}
                type="button"
              />
              <button
                aria-label={t('badge_details', { badge: badge.name })}
                className="absolute top-(--spacing-1) right-(--spacing-1) m-0 grid size-(--spacing-7) cursor-pointer appearance-none place-items-center rounded-full border-2 border-solid border-badge-question bg-transparent p-0 [font-family:inherit] text-(length:--font-size-2) leading-[inherit] text-inherit shadow-[0_8px_15px_rgba(0,0,0,0.1)] hover:bg-badge-question hover:text-white focus:bg-badge-question focus:text-white"
                data-testid={`badge-detail-${index}`}
                onClick={(e) => handleOpen(e, index)}
                type="button"
              >
                <QuestionIcon className="size-[1.2em]" />
              </button>
            </div>
          );
        })}
      {!!selectedGame &&
        customBadges[selectedGame?.value] &&
        customBadges[selectedGame?.value]?.map((badge, index) => {
          return (
            <button
              className={cn(BADGE, isActive(index) && '[filter:none]')}
              key={`${badge}-${Number(index) + 1}`}
              onClick={() => handleClick(index)}
              type="button"
            >
              <span className="text-(length:--font-size-9)">{badge}</span>
            </button>
          );
        })}
    </div>
  );
}

export default Badges;
