import React from 'react';
import { Badges, Header, Selection } from 'components';
import styles from './Tracker.module.scss';

const Tracker: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Header />
        <Badges />
        <div className={styles.list}>
          <Selection />
          <Selection />
          <Selection />
        </div>
      </div>
    </div>
  );
};

export default Tracker;
