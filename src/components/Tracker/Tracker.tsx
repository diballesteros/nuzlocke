import React from 'react';
import { Header, Selection } from 'components';
import styles from './Tracker.module.scss';

const Tracker: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Header />
        <Selection />
      </div>
    </div>
  );
};

export default Tracker;
