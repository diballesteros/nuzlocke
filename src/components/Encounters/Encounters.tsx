import React from 'react';
import { IconButton } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { Selection, Status } from 'components';
import styles from './Encounters.module.scss';

const Encounters: React.FC = () => {
  return (
    <div className={styles.table}>
      <div className={styles.row}>
        <div>Route</div>
        <div>Encounter</div>
        <div>Status</div>
        <div style={{ width: 48 }} />
      </div>
      <div className={styles.row}>
        <div>Route 1</div>
        <Selection />
        <Status />
        <IconButton aria-label="delete">
          <Delete />
        </IconButton>
      </div>
    </div>
  );
};

export default Encounters;
