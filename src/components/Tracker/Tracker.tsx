import React from 'react';
import { Badges, Encounters, Header } from 'components';
import styles from './Tracker.module.scss';

const Tracker: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Header />
        <Badges />
        <Encounters />
      </div>
    </div>
  );
};

export default Tracker;
