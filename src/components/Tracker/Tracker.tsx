import React from 'react';
import { Badges, Encounters, FAB, Options } from 'components';
import styles from './Tracker.module.scss';

const Tracker: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Badges />
        <Options />
        <Encounters />
      </div>
      <FAB />
    </div>
  );
};

export default Tracker;
