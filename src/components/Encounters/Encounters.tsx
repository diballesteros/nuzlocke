import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import AppContext from 'context/AppContext';
import { Pokemon, Status } from 'components';
import styles from './Encounters.module.scss';

const Encounters: React.FC = () => {
  const { state } = useContext(AppContext);

  return (
    <div className={styles.table}>
      <div className={`${styles.row} ${styles.tableHeader}`}>
        <div>LOCATION</div>
        <div>ENCOUNTER</div>
        <div>STATUS</div>
        <div style={{ width: 48 }} />
      </div>
      <div className={styles.list}>
        {state.games[state.selectedGame?.id]?.encounters?.map((encounter, index) => {
          return (
            <div className={styles.row} key={`encounter-row-${encounter.id}-${index + 1}`}>
              <div>{encounter.location}</div>
              <Pokemon encounterId={encounter.id} pokemon={encounter.pokemon} />
              <Status encounterId={encounter.id} status={encounter.status} />
              <IconButton aria-label="delete">
                <Delete />
              </IconButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Encounters;
