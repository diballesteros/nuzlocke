import React from 'react';
import { Badges } from 'components';
import { Encounters, FAB, Options } from 'components/Tracker/elements';
import styles from './Tracker.module.scss';

function Tracker(): JSX.Element {
  return (
    <section className={styles.layout}>
      <div className={styles.container}>
        <Badges />
        <Options />
        <Encounters />
      </div>
      <FAB />
    </section>
  );
}

export default Tracker;
