import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { Share } from 'components';
import { BadgeEditor } from 'components/Badges/elements';
import { AddEncounter, ResetEncounters } from 'components/Tracker/elements';
import POKEMON from 'constants/pokemon';
import useStore from 'store';
import styles from './FAB.module.scss';

const FAB: React.FC = () => {
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
            <span className={styles.label}>Share</span>
            <Share
              disabled={!selectedGame}
              icon
              text={games[selectedGame?.value]?.encounters?.reduce(
                (str, enc, i) => {
                  const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
                  return `${str}
      ${i + 1}. ${enc.location} - ${foundPokemon?.text || 'N/A'} - ${enc.status?.text || 'N/A'}`;
                },
                `Nuzlocke Encounter List
        `
              )}
            />
          </div>
          {selectedGame?.value && Number(selectedGame.value) <= 13 && (
            <div className={styles.listItem} data-testid="fab-add-edit-badges">
              <span className={styles.label}>Edit Badges</span>
              <BadgeEditor icon />
            </div>
          )}
          <div className={styles.listItem} data-testid="fab-add-encounter">
            <span className={styles.label}>Add Encounter</span>
            <AddEncounter icon />
          </div>
          <div className={styles.listItem} data-testid="fab-reset-encounters">
            <span className={styles.label}>Reset Encounters</span>
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
};

export default FAB;
