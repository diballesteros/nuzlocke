import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { Share } from 'components';
import { BadgeEditor, CustomBadgeEditor } from 'components/Badges/elements';
import { AddEncounter, ResetEncounters } from 'components/Tracker/elements';
import { MAX_GAME } from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import useStore from 'store';
import styles from './FAB.module.scss';

function FAB(): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((prevState) => !prevState);
  };
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  return (
    <div className={styles.fab} data-testid="fab-tracker">
      {open && (
        <div className={styles.list}>
          <div className={styles.listItem}>
            <span className={styles.label}>{t('share')}</span>
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
            <div className={styles.listItem} data-testid="fab-add-edit-badges">
              <span className={styles.label}>{t('edit_badges')}</span>
              <BadgeEditor icon />
            </div>
          )}
          {selectedGame?.value && Number(selectedGame.value) > MAX_GAME && (
            <div className={styles.listItem} data-testid="fab-add-edit-badges">
              <span className={styles.label}>{t('edit_badges')}</span>
              <CustomBadgeEditor icon />
            </div>
          )}
          <div className={styles.listItem} data-testid="fab-add-encounter">
            <span className={styles.label}>{t('add_encounter')}</span>
            <AddEncounter icon />
          </div>
          <div className={styles.listItem} data-testid="fab-reset-encounters">
            <span className={styles.label}>{t('reset_encounters', { count: 2 })}</span>
            <ResetEncounters icon />
          </div>
        </div>
      )}
      <Button
        active={open}
        aria-label="tracker-options"
        className={styles.button}
        circular
        icon="cog"
        onClick={handleClick}
        toggle
        type="button"
      />
    </div>
  );
}

export default FAB;
