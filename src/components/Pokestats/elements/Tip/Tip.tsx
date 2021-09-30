import React from 'react';
import styles from './Tip.module.scss';

interface TipProps {
  missing: string;
}

const Tip: React.FC<TipProps> = ({ missing }) => {
  return (
    <div className={styles.container} data-testid="status-tip">
      <p className={styles.missing}>
        In the Tracker set a pokémon to the <strong>{missing}</strong> status to see it here!
      </p>
    </div>
  );
};

export default Tip;
