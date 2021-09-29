import React from 'react';
import styles from './Tip.module.scss';

interface TipProps {
  missing: string;
}

const Tip: React.FC<TipProps> = ({ missing }) => {
  return (
    <div className={styles.container}>
      <p className={styles.missing}>
        In the Tracker set a pokémon to the status<strong>{missing}</strong> to see it here!
      </p>
    </div>
  );
};

export default Tip;
