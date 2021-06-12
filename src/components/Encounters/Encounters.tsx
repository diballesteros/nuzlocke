import React from 'react';
import { Selection, Status } from 'components';
import styles from './Encounters.module.scss';

const Encounters: React.FC = () => {
  return (
    <div className={styles.table}>
      <div className={styles.row}>
        <div>Route</div>
        <div>Encounter</div>
        <div>Status</div>
      </div>
      <div className={styles.row}>
        <div>Route 1</div>
        <Selection />
        <Status />
        <span>X</span>
      </div>
    </div>
  );
};

export default Encounters;
