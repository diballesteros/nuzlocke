import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import useStore from 'store';
import { AddEncounter, ResetEncounters, Share } from 'components';
import styles from './FAB.module.scss';

const FAB: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((prevState) => !prevState);
  };
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  return (
    <div className={styles.fab}>
      {open && (
        <div className={styles.list}>
          <div className={styles.listItem}>
            <span className={styles.label}>Share</span>
            <Share
              disabled={!selectedGame}
              icon
              text={games[selectedGame?.value]?.encounters?.reduce(
                (str, enc, i) => {
                  return `${str}
      ${i + 1}. ${enc.location} - ${enc.pokemon?.text || 'N/A'} - ${enc.status?.text || 'N/A'}`;
                },
                `Nuzlocke Encounter List
        `
              )}
            />
          </div>
          <div className={styles.listItem}>
            <span className={styles.label}>Add Encounter</span>
            <AddEncounter icon />
          </div>
          <div className={styles.listItem}>
            <span className={styles.label}>Reset Encounters</span>
            <ResetEncounters icon />
          </div>
        </div>
      )}
      <Button
        active={open}
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
