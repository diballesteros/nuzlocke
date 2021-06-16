import React from 'react';
import { IconButton } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { Pokemon, Status } from 'components';
import styles from './Encounters.module.scss';

const Encounters: React.FC = () => {
  return (
    <div className={styles.table}>
      <div className={`${styles.row} ${styles.tableHeader}`}>
        <div>LOCATION</div>
        <div>ENCOUNTER</div>
        <div>STATUS</div>
        <div style={{ width: 48 }} />
      </div>
      <div className={styles.row}>
        <div>Route 1</div>
        <Pokemon />
        <Status />
        <IconButton aria-label="delete">
          <Delete />
        </IconButton>
      </div>
      <div className={styles.row}>
        <div>Route 1</div>
        <Pokemon />
        <Status />
        <IconButton aria-label="delete">
          <Delete />
        </IconButton>
      </div>
      <div className={styles.row}>
        <div>Route 1</div>
        <Pokemon />
        <Status />
        <IconButton aria-label="delete">
          <Delete />
        </IconButton>
      </div>
      <div className={styles.row}>
        <div>Route 1</div>
        <Pokemon />
        <Status />
        <IconButton aria-label="delete">
          <Delete />
        </IconButton>
      </div>
      <div className={styles.row}>
        <div>Route 1</div>
        <Pokemon />
        <Status />
        <IconButton aria-label="delete">
          <Delete />
        </IconButton>
      </div>
    </div>
  );
};

export default Encounters;
