import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share } from 'components';
import { BadgeEditor, CustomBadgeEditor } from 'components/Badges/elements';
import { AddEncounter, ResetEncounters } from 'components/Tracker/elements';
import { MAX_GAME } from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import useStore from 'store';
import { FAB_ICON, FabButton } from '@/components/ui/fab-button';
import { SettingsIcon } from '@/components/ui/icons';

const ITEM = 'flex flex-row flex-nowrap items-center gap-(--spacing-3)';
// The grey tag naming each button
const LABEL =
  'grid h-fit place-items-center rounded-[4px] bg-label-strong px-(--spacing-2) py-(--spacing-1) text-white shadow-[0_0_3px_var(--color-white)]';

function FAB(): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((prevState) => !prevState);
  };
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  return (
    <div
      className="fixed right-(--spacing-2) bottom-(--spacing-3) z-1 [display:none] max-sm:flex max-sm:flex-col max-sm:flex-nowrap max-sm:items-end max-sm:gap-(--spacing-2)"
      data-testid="fab-tracker"
    >
      {open && (
        <div className="flex flex-col flex-nowrap items-end gap-(--spacing-2)">
          <div className={ITEM}>
            <span className={LABEL}>{t('share')}</span>
            <Share
              disabled={!selectedGame}
              icon
              text={games[selectedGame?.value]?.encounters?.reduce(
                (str, enc, i) => {
                  const foundPokemon = POKEMAP.get(enc.pokemon);
                  return `${str}
      ${Number(i) + 1}. ${enc.location} - ${foundPokemon?.text || 'N/A'} - ${
        enc.status?.text || 'N/A'
      }`;
                },
                `Nuzlocke Encounter List
        `
              )}
            />
          </div>
          {selectedGame?.value && Number(selectedGame.value) <= MAX_GAME && (
            <div className={ITEM} data-testid="fab-add-edit-badges">
              <span className={LABEL}>{t('edit_badges')}</span>
              <BadgeEditor icon />
            </div>
          )}
          {selectedGame?.value && Number(selectedGame.value) > MAX_GAME && (
            <div className={ITEM} data-testid="fab-add-edit-badges">
              <span className={LABEL}>{t('edit_badges')}</span>
              <CustomBadgeEditor icon />
            </div>
          )}
          <div className={ITEM} data-testid="fab-add-encounter">
            <span className={LABEL}>{t('add_encounter')}</span>
            <AddEncounter icon />
          </div>
          <div className={ITEM} data-testid="fab-reset-encounters">
            <span className={LABEL}>{t('reset_encounters', { count: 2 })}</span>
            <ResetEncounters icon />
          </div>
        </div>
      )}
      {/* The `ui` class keeps the specs' `fab-tracker > .ui` locator */}
      <FabButton
        active={open}
        aria-label="tracker-options"
        className="ui"
        colour="toggle"
        onClick={handleClick}
      >
        <SettingsIcon className={FAB_ICON} />
      </FabButton>
    </div>
  );
}

export default FAB;
